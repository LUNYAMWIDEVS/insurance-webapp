from app import celery_app
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone
from ...helpers.tasks import send_mail_, send_sms


@celery_app.task(name="send crm mail")
def send_email(*args):
    """
    Function to template email and send it
    Args:
        args (list): list of possible arguments
    Returns:
        None
    """
    subject, body, recipients = args
    send_mail_.delay(
        subject=subject,
        message=body,
        from_email=settings.EMAIL_SENDER,
        recipient_list=recipients,
        html_message=body,
        fail_silently=False,)


def send_message(message_obj):
    """
    Function to template email and send it
    Args:
        message_obj (obj): message object
        args (list): list of possible arguments
        kwargs (dict): key worded arguments
    Returns:
        None
    """
    if message_obj.email_body:
        recipients = []
        subject = message_obj.email_subject
        body = message_obj.email_body
        clients = [user.email for user in message_obj.individual_clients.all()]
        corporate_clients = [user.email for user in message_obj.corporate_clients.all()]
        contact_persons = [
            user.email for user in message_obj.contact_persons.all()]
        recipients = contact_persons + clients + corporate_clients
        send_email.delay(subject, body, recipients)
    if message_obj.sms:
        sms = message_obj.sms
        recipients = []
        clients = [user.phone_number[:2].replace("07", "+2547") + user.phone_number[2:]
                   if user.phone_number[:2] == "07" else user.phone_number for user
                   in message_obj.individual_clients.all()]
        corporate_clients = [
            user.phone_number[:2].replace("07", "+2547") + user.phone_number[2:]
            if user.phone_number[:2] == "07" else user.phone_number
            for user in message_obj.corporate_clients.all()]
        contact_persons = [
            user.phone_number[:2].replace("07", "+2547") + user.phone_number[2:]
            if user.phone_number[:2] == "07" else user.phone_number
            for user in message_obj.contact_persons.all()]
        recipients = contact_persons + clients + corporate_clients
        send_sms.delay(sms, recipients)
    message_obj.sent_at = timezone.now()
    message_obj.save()


def template_email(*args, **kwargs):
    """
    Function to template email and send it
    Args:
        subject (str): email subject
        args (list): list of possible arguments
        kwargs (dict): key worded arguments
    Returns:
        None
    """
    template_name, recipient, subject, message = args
    body = render_to_string(template_name, kwargs)
    send_mail_.delay(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_SENDER,
        recipient_list=[recipient],
        html_message=body,
        fail_silently=False,)
