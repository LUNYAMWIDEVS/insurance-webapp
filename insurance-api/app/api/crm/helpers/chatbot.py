
from django.conf import settings
import dialogflow_v2 as dialogflow
import base64
from google.oauth2 import service_account

ENCODED_CREDENTIALS = settings.GOOGLE_APPLICATION_CREDENTIALS

# credentials_json = json.load(open("brooksbotter-leqf-e87602926544.json"))
# encoded_creds =  base64.b64encode(str(credentials_json).encode("utf-8")).decode("utf-8")
# decoded_creds = base64.b64decode(encoded_creds).decode("utf-8")

# GOOGLE_APPLICATION_CREDENTIALS = settings.GOOGLE_APPLICATION_CREDENTIALS


def detect_intent_from_text(text, session_id, language_code="en"):

    decoded_creds = base64.b64decode(ENCODED_CREDENTIALS).decode("utf-8")
    credentials = (
        service_account.Credentials.from_service_account_info(eval(decoded_creds)))

    dialogflow_session_client = dialogflow.SessionsClient(credentials=credentials)
    PROJECT_ID = "brooksbotter-leqf"

    session = dialogflow_session_client.session_path(PROJECT_ID, session_id)
    text_input = dialogflow.types.TextInput(text=text, language_code=language_code)
    query_input = dialogflow.types.QueryInput(text=text_input)
    # import pdb; pdb.set_trace()
    response = dialogflow_session_client.detect_intent(
        session=session, query_input=query_input)
    return response.query_result


def fetch_reply(query, session_id):
    response = detect_intent_from_text(query, session_id)
    return response.fulfillment_text
