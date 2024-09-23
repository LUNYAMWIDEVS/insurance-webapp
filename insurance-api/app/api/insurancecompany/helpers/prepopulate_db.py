import os
import sys
import datetime
import pandas as pd
from ...helpers.push_id import PushID


def migrate_data(apps, schema_editor):
    """
    Autopopulate the DB with insurance companies
    """
    file = os.path.join(
        sys.path[0], "app/api/insurancecompany/helpers/companies.json")
    df = pd.read_json(file, lines=True)
    companies = df.to_dict("records")
    push_id = PushID()
    _ = [company.update(
        {
            "created_at": datetime.datetime.now(),
            "updated_at": datetime.datetime.now(),
            "id": push_id.next_id()
        }) for company in companies]
    InsuranceCompany = apps.get_model('insurancecompany', 'InsuranceCompany')
    InsuranceCompany.objects.bulk_create([
        InsuranceCompany(**company) for company in companies])
