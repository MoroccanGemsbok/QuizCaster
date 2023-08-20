import PyPDF2
import openai
from pprint import pprint
from preprocessing import replace_ligatures, remove_duplicates, remove_hyphens, to_lowercase, remove_newlines, split_into_sentences, group_sentences
from postprocessing import process_tf, scramble_answers
import time
from concurrent.futures import ThreadPoolExecutor
import json
import markdown
from bs4 import BeautifulSoup
import requests
from functools import partial
from env import openai_api_key

start = time.time()

GPT_KEY = openai_api_key
openai.api_key = GPT_KEY
SENTENCES_PER_PROMPT = 5
QUESTIONS_PER_PROMPT = 1
PATH = "https://en.wikipedia.org/wiki/Genshin_Impact"
TYPE = "website"  # one of: "pdf", "md", "website", "youtube"
PREPROMPT_MC = """I will give you a paragraph. You will create a JSON of 1 multiple-choice question and answers from the information in the paragraph.
They must be output in the following format:
{ "question": <question here>, "answers": [<answer 1>, <answer 2>, <answer 3>, <answer 4>],  "correct_answer": [<index of correct answer>]}


The paragraph to be sampled from is as follows:

"""
PREPROMPT_TF = """I will give you a paragraph. You will create a JSON of 1 true-false statement and answers from the information in the paragraph.
They must be output in the following format:
{ "question": <statement here>, "answers": ["true", "false"],  "correct_answer": [<index of correct answer>]}


The paragraph to be sampled from is as follows:

"""
PREPROMPT_SUMMARY = """I will give you a paragraph. You will create a one-sentence summary from the information in the paragraph. Format your output into a single string."""


def summary_prompt(index, text, SUMMARY):
    messages = [
        {"role": "user", "content": PREPROMPT_SUMMARY + text[index] + "\n\n", }]

    response = openai.ChatCompletion.create(
        model="gpt-4",
        max_tokens=100,
        temperature=1.0,
        messages=messages)
    response_text = response.choices[0].message.content
    SUMMARY.append(response_text)


def gpt_prompt(index, text, ALL_QUESTIONS):
    if index % 2 == 0:
        PREPROMPT = PREPROMPT_MC
    else:
        PREPROMPT = PREPROMPT_TF
    messages = [
        {"role": "user", "content": PREPROMPT + text[index] + "\n\n", }]

    response = openai.ChatCompletion.create(
        model="gpt-4",
        max_tokens=100,
        temperature=1.2,
        messages=messages)

    response_json = json.loads(response.choices[0].message.content)

    if index % 2 == 0:
        response_json = scramble_answers(response_json)
        response_json["format"] = "MC"
    else:
        response_json = process_tf(response_json)
        response_json["format"] = "TF"

    ALL_QUESTIONS.append(response_json)


def read_pdf(file_path: str) -> str:
    pdfFileObj = open(file_path, 'rb')
    print(type(pdfFileObj))
    reader = PyPDF2.PdfReader(pdfFileObj)

    for i, page in enumerate(reader.pages):
        if i == 0:
            text = page.extract_text()
        else:
            text = text + page.extract_text()

    return text


def pdf_preprocess(text: str) -> list[str]:
    processed_text = split_into_sentences(replace_ligatures(text))
    grouped_text = group_sentences(processed_text, SENTENCES_PER_PROMPT)
    return grouped_text


def read_markdown(file_path: str) -> str:
    with open(file_path, 'r', encoding='utf-8') as file:
        markdown_content = file.read()
    html_content = markdown.markdown(markdown_content)
    return html_content


def markdown_preprocess(text: list[str]) -> list[str]:
    text = [line for line in text if line != '']
    text = remove_duplicates(text)
    text = group_sentences(text, SENTENCES_PER_PROMPT)
    return text


def process_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    if TYPE == "website":
        paragraphs = soup.find_all('p')
    elif TYPE == "md":
        paragraphs = soup.find_all(['p', 'li'])
    extracted_text = '\n'.join([p.get_text() for p in paragraphs])
    return extracted_text


# type is either "pdf", "md", or "website"
def get_grouped_text(path: str, type: str) -> list[str]:
    if type == "pdf":
        text = read_pdf(path)
        grouped_text = pdf_preprocess(text)
    elif type == "md":
        text = process_html(read_markdown(path)).splitlines()
        grouped_text = markdown_preprocess(text)
    elif type == "website":
        page = requests.get(path)
        text = process_html(page.content).splitlines()
        grouped_text = markdown_preprocess(text)

    return grouped_text


def get_summary(grouped_text) -> list[str]:
    SUMMARY = []
    text_range = list(range(0, len(grouped_text)))
    with ThreadPoolExecutor() as executor:
        partial_func = partial(
            summary_prompt, text=grouped_text, SUMMARY=SUMMARY)
        results = executor.map(partial_func, text_range)

    SUMMARY = ' '.join(SUMMARY)
    return SUMMARY


def get_questions(grouped_text) -> list[dict]:
    ALL_QUESTIONS = []
    text_range = list(range(0, len(grouped_text)))
    with ThreadPoolExecutor() as executor:
        partial_func = partial(gpt_prompt, text=grouped_text)
        results = executor.map(partial_func, text_range)

    return ALL_QUESTIONS
