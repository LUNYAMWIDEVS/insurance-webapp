from django.db import models
from django.utils.translation import gettext_lazy as _


class InsuranceClasses(models.TextChoices):
    """
    COMM_GEN_TPO = 'COMM_GEN_TPO', _('Motor Commercial Insurance – GC - T.P.O')
    Insurance Class choices
    """

    ALL_RISKS = "ALL_RISKS", _("All Risks")
    BIG_BOND = "BIG_BOND", _("Big Bond")
    BURGLARY = "BURGLARY", _("Burglary")
    BUSINESS_COMBINED = "BUSINESS_COMBINED", _("Business Combined")
    BUSINESS_INTERRUPTION = "BUSINESS_INTERRUPTION", _("Business Interruption")
    CARRIERS_LEGAL_LIABILITY = "CARRIERS_LEGAL_LIABILITY", _("Carriers Legal Liability")
    COMMERCIAL_BOND = "COMMERCIAL_BOND", _("Commercial Bond")
    CONTRACT_BOND = "CONTRACT_BOND", _("Contract Bond")
    CONTRACTORS_ALL_RISKS = "CONTRACTORS_ALL_RISKS", _("Contractors All Risks")
    COURT_BOND = "COURT_BOND", _("Court Bond")
    CROP = "CROP", _("Crop Insurance")
    CUSTOM_BOND = "CUSTOM_BOND", _("Custom Bond")
    CYBER_RISK = "CYBER_RISK", _("Cyber Risk")
    DETERIORATION_OF_STOCK = "DETERIORATION_OF_STOCK", _("Deterioration of Stock")
    DIRECTORS_OFFICERS_LIABILITY = "DIRECTORS_OFFICERS_LIABILITY", _(
        "Directors & Officers Liability"
    )
    DOMESTIC_PACKAGE = "DOMESTIC_PACKAGE", _("Domestic Package")
    ELECTRONIC_EQUIPMENT = "ELECTRONIC_EQUIPMENT", _("Electronic Equipment")
    EMPLOYER_LIABILITY = "EMPLOYER_LIABILITY", _("Employer's Liability - EL")
    ERECTION_ALL_RISKS = "ERECTION_ALL_RISKS", _("Erection All Risks")
    FIDELITY_GURANTEE = "FIDELITY_GURANTEE", _("Fidelity Guarantee")
    FIRE_PERILS = "FIRE_PERILS", _("Fire & Perils")
    GOLFERS = "GOLFERS", _("Golfers")
    GOODS_IN_TRANSIT = "GOODS_IN_TRANSIT", _("Goods in Transit - GIT")
    GROUP_ACCIDENT = "GROUP_ACCIDENT", _("Group Accident")
    GROUP_MEDICAL = "GROUP_MEDICAL", _("Group Medical")
    HOSPITAL_MALPRACTICE = "HOSPITAL_MALPRACTICE", _("Hospital Malpractice")
    IMMIGRATION_BOND = "IMMIGRATION_BOND", _("Immigration Bond")
    IMPORT_BOND = "IMPORT_BOND", _("Import Bond")
    INDUSTRIAL_ALL_RISKS = "INDUSTRIAL_ALL_RISKS", _("Industrial All Risks")
    INVESTMENT = "INVESTMENT", _("Investment")
    LAST_EXPENSE = "LAST_EXPENSE", _("Last Expense")
    LIFE = "LIFE", _("Life")
    LIVESTOCK = "LIVESTOCK", _("Livestock")
    MACHINERY_BREAKDOWN = "MACHINERY_BREAKDOWN", _("Machinery Breakdown Insurance")
    MARINE = "MARINE", _("Marine")
    MEDICAL = "MEDICAL", _("Medical")
    MONEY = "MONEY", _("Money")
    COMM_GEN = "COMM_GEN", _("Motor Commercial Insurance – General Cartage - Comp")
    COMM_OWN = "COMM_OWN", _("Motor Commercial Insurance – Own Goods - Comprehensive")
    COMM_OWN_TPO = "COMM_OWN_TPO", _("Motor Commercial Insurance – Own Goods - T.P.O")
    PRIV_COMP = "PRIV_COMP", _("Motor Private Insurance – Comprehensive")
    PRIV_TPO = "PRIV_TPO", _("Motor Private Insurance – T.P.O")
    PSV_COMP = "PSV_COMP", _("Motor PSV – Comprehensive")
    PSV_TPO = "PSV_TPO", _("Motor PSV – T.P.O")
    OCCUPIERS_LIABILITY = "OCCUPIERS_LIABILITY", _("Occupiers Liability")
    OWNERS_LIABILITY = "OWNERS_LIABILITY", _("Owners Liability")
    PAYMENT_BOND = "PAYMENT_BOND", _("Payment Bond")
    PENSION = "PENSION", _("Pension")
    PERFORMANCE_BOND = "PERFORMANCE_BOND", _("Performance Bond")
    PERSONAL_ACCIDENT = "PERSONAL_ACCIDENT", _("Personal Accident")
    PLATE_GLASS = "PLATE_GLASS", _("Plate Glass")
    POLITICAL_VIOLENCE_TERRORISM = "POLITICAL_VIOLENCE_TERRORISM", _(
        "Political Violence & Terrorism"
    )
    PRODUCTS_LIABILITY = "PRODCUTS LIABILITY", _("Products Liability")
    PROFESSIONAL_INDEMNITY = "PROFESSIONAL_INDEMNITY", _("Professional Indemnity")
    PUBLIC_LIABILITY = "PUBLIC_LIABILITY", _("Public Liability Insurance")
    STOCK = "STOCK", _("Stock")
    STUDENT_PERSONAL_ACCIDENT = "STUDENT_PERSONAL_ACCIDENT", _(
        "Student Personal Accident"
    )
    TENDER_BOND = "TENDER_BOND", _("Tender Bond")
    TRAVEL = "TRAVEL", _("Travel")
    WORK_INJURY_BENEFITS_W = "WORK_INJURY_BENEFITS_W", _(
        "Work Injury Benefits ACT - WIBA"
    )
    WORK_INJURY_BENEFITS_WP = "WORK_INJURY_BENEFITS_WP", _(
        "Work Injury Benefits ACT - WIBA - Plus"
    )
