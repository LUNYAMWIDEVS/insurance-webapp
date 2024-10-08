# Generated by Django 3.2.4 on 2021-08-09 12:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('motor', '0022_auto_20210805_0709'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historicalmotorpolicy',
            name='insurance_class',
            field=models.CharField(choices=[('COMM_GEN', 'Motor Commercial Insurance – GC - Comp'), ('COMM_OWN', 'Motor Commercial Insurance – Own Goods - Comprehensive'), ('COMM_OWN_TPO', 'Motor Commercial Insurance – Own Goods - T.P.O'), ('PRIV_COMP', 'Motor Private Insurance – Comprehensive'), ('PRIV_TPO', 'Motor Private Insurance – T.P.O'), ('PSV_COMP', 'Motor PSV – Comprehensive'), ('PSV_TPO', 'Motor PSV – T.P.O')], default='COMM_GEN', max_length=50),
        ),
        migrations.AlterField(
            model_name='motorpolicy',
            name='insurance_class',
            field=models.CharField(choices=[('COMM_GEN', 'Motor Commercial Insurance – GC - Comp'), ('COMM_OWN', 'Motor Commercial Insurance – Own Goods - Comprehensive'), ('COMM_OWN_TPO', 'Motor Commercial Insurance – Own Goods - T.P.O'), ('PRIV_COMP', 'Motor Private Insurance – Comprehensive'), ('PRIV_TPO', 'Motor Private Insurance – T.P.O'), ('PSV_COMP', 'Motor PSV – Comprehensive'), ('PSV_TPO', 'Motor PSV – T.P.O')], default='COMM_GEN', max_length=50),
        ),
    ]
