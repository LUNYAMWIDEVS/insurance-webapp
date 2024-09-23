from .motor_policy import (CreateMotorPolicyReceipt, UpdateMotorPolicyReceipt,
                           DeleteMotorPolicyReceipt)
import graphene


class Mutation(graphene.ObjectType):
    create_motor_receipt = CreateMotorPolicyReceipt.Field()
    update_motor_receipt = UpdateMotorPolicyReceipt.Field()
    delete_motor_receipt = DeleteMotorPolicyReceipt.Field()
