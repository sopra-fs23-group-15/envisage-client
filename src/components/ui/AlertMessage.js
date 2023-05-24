import { Collapse } from "@mui/material";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import React, { useState } from "react";

export const AlertMessage = (props) => {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(false);
    props.alert(<div className="alertMsg"></div>);
  };

  return (
    <Collapse in={open}>
      <Alert
        className="alertMsg"
        severity="error"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => handleClick()}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {props.error}
      </Alert>
    </Collapse>
  );
};
