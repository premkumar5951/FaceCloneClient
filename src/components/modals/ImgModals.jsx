import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import NoPhotographyIcon from "@mui/icons-material/NoPhotography";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { makeSelector } from "../../reducers/selectors";
import { useNavigate } from "react-router";
import { storage } from "../firebase/Storage";
import { LinearProgress } from "@mui/material";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <>
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label='close'
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    </>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const stateSelector = createSelector(makeSelector, (user) => ({
  user,
}));

export default function CustomizedDialogs({ sameuser }) {
  const [propic, setpropic] = React.useState(null);
  const { user } = useSelector(stateSelector);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [profileUpdated, setprofileupdated] = React.useState(false);
  const [Progress, setprogress] = useState(0);
  const [upload, setupload] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setpropic(null);
  };

  const DeleteFromFirebase = (url) => {
    const picRef = storage.refFromURL(url);
    picRef
      .delete()
      .then(() => {
        // setprogress(0);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const userUpdate = async (e) => {
    e.preventDefault();
    const userdetail = {
      userId: user._id,
    };
    if (propic) {
      const filename = Date.now() + propic.name;
      setupload(true);
      const prevUrl = user.profilepic;
      try {
        const uploadTask = storage
          .ref(`images/persons/${filename}`)
          .put(propic);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setprogress(progress);
          },
          (error) => {
            console.log("image error", error);
          },
          () => {
            storage
              .ref("images/persons")
              .child(filename)
              .getDownloadURL()
              .then(async (url) => {
                userdetail.profilepic = url;
                if(prevUrl){
                  DeleteFromFirebase(prevUrl);
                }
                setpropic(null);
                setupload(false);
                setprofileupdated(true);
                try {
                  const res = await fetch(
                    `${process.env.REACT_APP_HOST}/users/${user._id}`,
                    {
                      method: "PUT",
                      headers: {
                        "content-type": "application/json",
                      },
                      body: JSON.stringify(userdetail),
                    }
                  );
                  const data = await res.json();
                  if (res.status === 200) {
                    setprofileupdated(true);
                    navigate(0);
                  }
                } catch (e) {
                  console.log(e);
                }
              });
          }
        );
      } catch (e) {
        console.log("image error", e);
      }
    }
  };
  return (
    <div>
      {sameuser ? (
        <>
          <div className='propic' onClick={handleClickOpen}>
            <CameraAltIcon className='cameraIcon' />
          </div>
        </>
      ) : null}

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}>
        <BootstrapDialogTitle
          id='customized-dialog-title'
          onClose={handleClose}>
          Profile Picture
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div className='uploadfile'>
            {propic ? (
              <div className='selectedpic'>
                <img
                  src={URL.createObjectURL(propic)}
                  className='viewpic'
                  alt=''
                />
                <span className='canclepic' onClick={() => setpropic(null)}>
                  Remove Image
                </span>
              </div>
            ) : (
              <>
                {profileUpdated ? (
                  <span className=' text-success fw-bold fs-1 updatedtext'>
                    Profile Picture Updated <DoneAllIcon className='doneicon' />
                  </span>
                ) : (
                  <>
                    <div className='selectedpic'>
                      <NoPhotographyIcon className='nophoto' />
                      <span>No file Selected</span>
                    </div>
                    <label htmlFor='propic'>
                      <div className='selectbox text-center'>
                        <span>Upload Image</span>
                      </div>
                      <input
                        type='file'
                        id='propic'
                        style={{ display: "none" }}
                        accept='.png,.jpg,.jpeg'
                        onChange={(e) => setpropic(e.target.files[0])}
                      />
                    </label>
                  </>
                )}
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <div className='proload'>
            {propic ? (
              !upload ? (
                <>
                  <Button autoFocus onClick={userUpdate}>
                    UPDATE PROFILE
                  </Button>
                </>
              ) : null
            ) : null}
            {upload ? (
              <div className='progress1'>
                <span className='upload'>Uploading {Progress}%</span>
                <LinearProgress variant='determinate' value={Progress} />
              </div>
            ) : null}
          </div>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
