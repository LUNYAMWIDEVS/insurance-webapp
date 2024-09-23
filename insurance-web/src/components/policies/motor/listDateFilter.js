import moment from "moment";
import React, { useState } from "react";
import { DateInput } from "semantic-ui-calendar-react";
import { Button, Dropdown, Form, Icon, Modal } from "semantic-ui-react";

function DateFilter({
  onFilterChange,
  pagination,
  setIsFiltering,
  isFiltering,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const dateOptions = [
    { key: "start", text: "Start Date", value: "start" },
    { key: "end", text: "End Date", value: "end" },
    { key: "transaction", text: "Transaction Date", value: "transaction" },
  ];

  const handleDateTypeChange = (e, { value }) => {
    setSelectedDateType(value);
    setFromDate("");
    setToDate("");
  };

  const handleDateChange = (event, { name, value }) => {
    if (name === "fromDate") {
      setFromDate(value);
    } else if (name === "toDate") {
      setToDate(value);
    }
  };

  const filterPolicies = () => {
    if (onFilterChange && fromDate && selectedDateType && toDate) {
      console.log({ fromDate, toDate, onFilterChange });
      onFilterChange({
        variables: {
          page: 1,
          limit: 200,
          [`${selectedDateType}DateBegin`]: fromDate,
          [`${selectedDateType}DateEnd`]: toDate,
        },
      });
      setIsFiltering(null);
    }
  };

  const handleClearSelection = () => {
    setSelectedDateType("");
    setFromDate("");
    setToDate("");
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    handleClearSelection();
  };

  const clearFilter = () => {
    handleClearSelection();
    setIsFiltering(false);
  };

  return (
    <>
      {isFiltering ? (
        <Button color="blue" onClick={clearFilter}>
          {" "}
          <Icon name="cancel" size="small" /> Clear Filters
        </Button>
      ) : (
        <Button color="blue" onClick={handleOpenModal}>
          {" "}
          <Icon name="filter" size="small" /> Filter Policies
        </Button>
      )}

      <Modal open={modalOpen} onClose={handleCloseModal} size="small" closeIcon>
        <Modal.Header>Filter Policies by Date</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field required>
              <label>Select Date Filter</label>
              <Dropdown
                placeholder="Select Date Type"
                fluid
                selection
                options={dateOptions}
                onChange={handleDateTypeChange}
                value={selectedDateType}
                clearable // Allows unselecting the date type
              />
            </Form.Field>

            {selectedDateType && (
              <Form.Group widths="equal">
                <Form.Field required>
                  <label>From</label>
                  <DateInput
                    name="fromDate"
                    autoComplete="off"
                    placeholder="From"
                    popupPosition="bottom left"
                    value={fromDate}
                    iconPosition="left"
                    dateFormat="YYYY-MM-DD"
                    onChange={handleDateChange}
                  />
                </Form.Field>

                <Form.Field required>
                  <label>To</label>
                  <DateInput
                    name="toDate"
                    autoComplete="off"
                    placeholder="To"
                    popupPosition="bottom left"
                    value={toDate}
                    iconPosition="left"
                    dateFormat="YYYY-MM-DD"
                    onChange={handleDateChange}
                  />
                </Form.Field>
              </Form.Group>
            )}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleClearSelection} disabled={!selectedDateType}>
            Clear Selection
          </Button>
          <Button
            onClick={() => {
              filterPolicies();
              handleCloseModal();
            }}
            primary
          >
            Apply Filter
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default DateFilter;
