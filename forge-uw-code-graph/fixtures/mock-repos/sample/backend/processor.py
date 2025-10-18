import json

# @owner:data-team@uw.edu
def load_records(raw_text: str):
    return json.loads(raw_text)


def score_records(records):
    total = 0
    for record in records:
        total += record.get('score', 0)
    return total / max(len(records), 1)
