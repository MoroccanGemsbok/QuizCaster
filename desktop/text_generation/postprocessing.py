import random


def scramble_answers(question):

    correct_answer_index = question["answer"]
    if type(correct_answer_index) == list:
        correct_answer_index = correct_answer_index[0]

    correct_answer = question["options"][correct_answer_index]

    random.shuffle(question["options"])
    shuffled_answer_index = question["options"].index(correct_answer)
    question["answer"] = shuffled_answer_index

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
    if type(question["answer"]) == list:
        question["answer"] = question["answer"][0]
        
    return question
