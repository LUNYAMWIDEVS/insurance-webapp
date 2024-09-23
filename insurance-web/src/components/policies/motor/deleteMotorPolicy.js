import React, { useState, useContext, useEffect } from "react";
// import { Link } from 'react-router-dom';

import { useQuery, useMutation } from "@apollo/react-hooks";

import { DELETE_MOTOR_POLICY } from "../queries";

import DeleteModal from "../../modals/deletionModal";

export default function DeleteMotorPolicy({ props }) {
  const policyId = props.computedMatch.params.policyId;
  const [open, setOpen] = useState(false);
  const [deletePolicy, { data }] = useMutation(DELETE_MOTOR_POLICY);
  const deletePolicy = (e) => {
    e.preventDefault();
  };
  return <DeleteModal handleRemovalItem={deletePolicy} />;
}
