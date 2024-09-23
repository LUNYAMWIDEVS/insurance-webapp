import json
import logging
from django.http import HttpResponse
from twilio.rest import Client

from .helpers.chatbot import fetch_reply
from .models import WhatsappMessages
from django.conf import settings

from twilio.twiml.messaging_response import MessagingResponse
from django.utils import timezone
from rest_framework.decorators import api_view
from twilio.base.exceptions import TwilioRestException
from copy import deepcopy

account_sid = settings.TWILIO_ACC_SID
auth_token = settings.TWILIO_ACC_AUTH_TOKEN


@api_view(['POST'])
def sms_reply(request):
    msg = request.data.get('Body')
    phone_no = request.data.get('From')
    resp = MessagingResponse()
    resp.message("nice")  # chatbot response
    messages = WhatsappMessages()
    messages.whatsapp_sms = msg
    phone_no = phone_no.replace("whatsapp:", "")
    messages.whatsapp_phone_number = phone_no
    # messages.sales_agent_assigned=request.user
    messages.save()
    new_message = deepcopy(messages)
    new_message.whatsapp_response = reply
    new_message.created_at = None
    new_message.whatsapp_sms = None
    new_message.pk = None
    new_message.is_bot = True
    new_message.save()
    return HttpResponse(resp)


def send_whatsapp_message(msg, phone_no):
    client = Client(account_sid, auth_token)
    try:
        client.messages.create(
            from_='whatsapp:+254203893134',
            body=msg,
            to=f'whatsapp:{phone_no}'
        )
    except TwilioRestException as e:
        logging.warning(e)



def send_multi_whatsapp_message(message_obj):
    if message_obj.whatsapp_sms:

        recipients = []
        clients = []
        for user in message_obj.individual_clients.all():
                if "-" in user.phone_number and len(user.phone_number) <= 14 or user.phone_number[:2] == "07":
                    clients.append(user.phone_number[:2].replace("07", "+2547") + user.phone_number[2:].replace("-",""))
                elif "-" in user.phone_number or user.phone_number[:2] == "07":
                    phone_numbers_ = user.phone_number.split(";")
                    for phone_number_ in phone_numbers_:
                        clients.append(phone_number_[:2].replace("07", "+2547") + phone_number_[2:].replace("-",""))
                else:
                    clients.append(user.phone_number.replace("-",""))
        corporate_clients = []
        for user in message_obj.corporate_clients.all():
                if "-" in user.phone_number and len(user.phone_number) <= 14 or user.phone_number[:2] == "07":
                    corporate_clients.append(user.phone_number[:2].replace("07", "+2547") + user.phone_number[2:].replace("-",""))
                elif "-" in user.phone_number or user.phone_number[:2] == "07":
                    phone_numbers_ = user.phone_number.split(";")
                    for phone_number_ in phone_numbers_:
                        corporate_clients.append(phone_number_[:2].replace("07", "+2547") + phone_number_[2:].replace("-",""))
                else:
                    corporate_clients.append(user.phone_number.replace("-",""))
        
        recipients = clients + corporate_clients
        for phone_number in recipients:
            send_whatsapp_message(message_obj.whatsapp_sms,phone_number)
    message_obj.sent_at = timezone.now()
    message_obj.save()


