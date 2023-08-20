import random


def scramble_answers(question):
    answers = question["answers"]

    # HAHAHAHAHAAHAHAHAAHAH
    correct_answer = answers[question["correct_answer"][0]]

    random.shuffle(answers)
    question["answers"] = answers
    question["correct_answer"] = answers.index(correct_answer)

    # remove context-specific questions
    if "mentioned" in question["question"] or "text" in question["question"] or "paragraph" in question["question"]:
        return None

    return question


def process_tf(question):
    query = question["question"]
    if query[-1] == "?":
        query = query[:-1] + "."

    if query[:3] == "Did" or query[:3] == "Was":
        query = query[4:]
        query = query[0].upper() + query[1:]

    if query[:2] == "Is":
        query = query[3:]
        query = query[0].upper() + query[1:]

    question["question"] = query
    question["correct_answer"] = question["correct_answer"][0]
    return question
