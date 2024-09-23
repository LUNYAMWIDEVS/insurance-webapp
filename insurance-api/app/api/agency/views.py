from django.http import HttpResponse
from django.template.loader import render_to_string

from ..helpers.jwt_helper import decode_jwt
from .models import Agency


def activate_account(request, token):
    """
    Function to activate agency account
    Args:
        request (obj): request object
        token (str): user JWT token

    """
    DEFAULT_PARAMS = {
        'insurance_agency': '',
        'status_code': 403,
        "message": "Something went wrong.",
        "status": "Unauthorized"
    }
    payload, status_code = decode_jwt(token)
    if status_code != 200:
        rendered = render_to_string('unauthorized-403.html', DEFAULT_PARAMS)
        response = HttpResponse(rendered)
        return response
    try:
        agency = Agency.objects.get(agency_email=payload['email'])
        if not agency.is_active:
            agency.is_active = True
            agency.save()
            params = {
                'insurance_agency': agency.name,
                'message': 'Agency account has been activated successfully'
            }
            rendered = render_to_string('custom-actions.html', params)
            response = HttpResponse(rendered)
        elif agency and agency.is_active:
            params = {
                'insurance_agency': agency.name,
                'message': 'Agency account is currently active'
            }
            rendered = render_to_string('custom-actions.html', params)
            response = HttpResponse(rendered)
        return response

    except Agency.DoesNotExist:
        if Agency.objects.deleted_only().filter(email=payload['email']).first():
            params = DEFAULT_PARAMS.copy()
            params['message'] = 'Agency account deactivated'
            rendered = render_to_string('unauthorized-403.html', params)
            response = HttpResponse(rendered)
        else:
            params = DEFAULT_PARAMS.copy()
            params['status_code'] = 500
            params['status'] = 'Error'
            rendered = render_to_string('unauthorized-403.html', params)
            response = HttpResponse(rendered)
        return response
