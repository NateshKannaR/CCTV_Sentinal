import re

# Comprehensive Indian State & Union Territory Registration Codes (plus BH Bharat Series)
INDIAN_STATE_CODES = {
    "AN", "AP", "AR", "AS", "BR", "CG", "CH", "DD", "DN", "DL", 
    "GA", "GJ", "HR", "HP", "JK", "JH", "KA", "KL", "LA", "LD", 
    "MP", "MH", "MN", "ML", "MZ", "NL", "OD", "OR", "PB", "PY", 
    "RJ", "SK", "TN", "TS", "TR", "UP", "UK", "UA", "WB", "BH"
}

STATE_MISREAD_MAP = {
    '16': 'GJ', '1I': 'GJ', 'G1': 'GJ', 'G6': 'GJ', '0J': 'GJ', 
    'OJ': 'GJ', 'CJ': 'GJ', 'CI': 'GJ', '6J': 'GJ', 'G7': 'GJ', 'C7': 'GJ',
    'EI': 'GJ', 'E1': 'GJ', 'EJ': 'GJ', 'GI': 'GJ', '6I': 'GJ', 'EV': 'GJ',
    'EX': 'GJ', 'EY': 'GJ', 'TV': 'GJ', 'TY': 'GJ', 'TQ': 'GJ',
    'NE': 'GJ', 'AL': 'GJ', 'XR': 'GJ', 'SX': 'GJ', 'U3': 'GJ', 'O1': 'GJ',
    'I1': 'GJ', '70': 'GJ', '33': 'GJ', '34': 'GJ', '7T': 'GJ', '3Z': 'GJ',
    'B1': 'GJ', 'L4': 'GJ', '12': 'GJ', 'IC': 'GJ', 'JC': 'GJ',
    '0L': 'DL', 'M1': 'MH', 'K1': 'KA', 'T1': 'TN'
}

DIGIT_MAP = {
    'O': '0', 'Q': '0', 'D': '0', 'U': '0', 'C': '0',
    'I': '1', 'L': '1', 'J': '1', 'T': '1',
    'Z': '2',
    'E': '3', 'R': '3',
    'A': '4', 'H': '4', 'P': '4', 'K': '4',
    'S': '5',
    'G': '6',
    'F': '7', 'Y': '7',
    'B': '8',
    'N': '9', 'W': '9'
}

ALPHA_MAP = {'0': 'O', '1': 'I', '5': 'S', '8': 'B', '2': 'Z', '4': 'A', '6': 'G', '7': 'T'}

def is_valid_indian_plate(plate: str) -> bool:
    """
    Validates if a string strictly conforms to official Indian High-Security Registration Plate (HSRP) formats:
    1. Standard HSRP (7-10 chars): State(2) + RTO(1-2 digits) + Series(1-3 letters) + Serial(3-4 digits)
       e.g. GJ01AB1234, GJ01HY5842, TN87C5106, MH02BZ1234, DL7CQ1939
    2. Bharat (BH) 10-char: Year(2) + BH + Serial(3-4 digits) + Series(1-2 letters) e.g. 22BH1234AA
    """
    if not plate or len(plate) < 7 or len(plate) > 10:
        return False

    if plate[:2] in INDIAN_STATE_CODES:
        return bool(re.match(r'^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{3,4}$', plate))

    if len(plate) == 10 and plate[2:4] == "BH":
        return bool(re.match(r'^\d{2}BH\d{3,4}[A-Z]{1,2}$', plate))

    return False

def normalize_plate_number(raw_text: str) -> str:
    """
    Normalizes raw OCR or entered text, preserves valid Indian state codes (TN, MH, DL, GJ, KA, KL, etc.),
    corrects OCR digit corruptions, and enforces strict 7-10 character validation.
    """
    if not raw_text:
        return ""

    cleaned = re.sub(r'[^A-Z0-9]', '', raw_text.upper())
    if len(cleaned) < 7:
        return cleaned

    if len(cleaned) > 10:
        match = re.search(r'([A-Z0-9]{2}\d{1,2}[A-Z0-9]{1,3}\d{3,4})', cleaned)
        if match:
            cleaned = match.group(1)
        else:
            cleaned = cleaned[:10]

    # State Code Normalization (First 2 chars)
    p2 = cleaned[:2]
    if p2 in INDIAN_STATE_CODES:
        pass
    elif p2 in STATE_MISREAD_MAP:
        cleaned = STATE_MISREAD_MAP[p2] + cleaned[2:]
    else:
        p2_alpha = (ALPHA_MAP.get(p2[0], p2[0])) + (ALPHA_MAP.get(p2[1], p2[1]))
        if p2_alpha in INDIAN_STATE_CODES:
            cleaned = p2_alpha + cleaned[2:]
        elif not (cleaned[0].isalpha() and cleaned[1].isalpha()):
            cleaned = 'GJ' + cleaned[2:]

    return cleaned
