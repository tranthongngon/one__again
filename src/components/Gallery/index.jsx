import React, { useState, useEffect } from "react";
import "./style.css";
import Dialog from "@mui/material/Dialog";
import { storage } from "../../firebase";
import {
  ref,
  uploadBytesResumable,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import toast from "react-hot-toast";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Smile from "../../assets/images/smile.jpeg";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import LoadingService from "../loadingService";
import { Fancybox } from '@fancyapps/ui/dist/fancybox/fancybox.esm.js';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

const uniqueArrayObject = (array, key) => {
  return [...new Map(array.map((item) => [item[key], item])).values()];
};

export default function Gallery() {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [listUrl, setListUrl] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classFlexbox, setClassFlexbox] = useState("");
  const [dataDelete, setDataDelete] = useState(null);
  const [codeDefault, setCodeDefault] = useState("");
  const [checkConfirm, setCheckConfirm] = useState(false);
  const [dataImageView, setDataImageView] = useState({ img: "", index: 0 });

  const onChangeCodeConfirm = (e) => {
    setCodeDefault(e.target.value);
  };

  const handleConfirmValue = (e) => {
    e.preventDefault();
    if (codeDefault === "b25lX19hZ2FpbjA5MDY=") {
      setCheckConfirm(true);
      getAllImages();
    }
  };

  const onChangeUpload = (event) => {
    if (event.target.files.length === 2) {
      setClassFlexbox("flex-box-2i");
    } else if (event.target.files.length > 2) {
      setClassFlexbox("flex-box-3i");
    } else {
      setClassFlexbox("");
    }
    setImages(Object.values(event.target.files));
  };

  const handleClickOpen = () => {
    setImages([]);
    setProgress(0);
    setOpen(true);
  };

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const getAllImages = async () => {
    setListUrl([]);
    setLoading(true);
    await listAll(ref(storage, `gallery_one__again`)).then((res) => {
      setLoading(false);
      res.items.forEach((item) => {
        getDownloadURL(ref(storage, item.fullPath)).then((url) => {
          setListUrl((prevState) => [
            ...prevState,
            { url, fullPath: item.fullPath },
          ]);
        });
      });
      Fancybox.bind('[data-fancybox="gallery"]')
    });
  };

  const handleUpload = () => {
    const promises = [];
    // eslint-disable-next-line array-callback-return
    setLoading(true);
    images.map((image) => {
      const uploadImage = ref(storage, `gallery_one__again/${image.name}`);
      const uploadTask = uploadBytesResumable(uploadImage, image);
      promises.push(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (err) => {
          console.log(err);
        }
      );
    });

    Promise.all(promises)
      .then(() => {
        setLoading(false);
        toast.success("Upload images success.");
        getAllImages();
        handleClose();
      })
      .catch((err) => {
        setLoading(false);
        toast.success("Upload images error.");
        console.log(err);
      });
  };

  const clickDeleteImage = (item) => {
    setDataDelete(item.img || item);
    handleClickOpenDelete();
  };

  const handleDeleteImage = async () => {
    const desertRef = ref(storage, dataDelete.fullPath);
    await deleteObject(desertRef)
      .then(() => {
        toast.success("Delete images success.");
        setDataImageView({ img: "", index: 0 });
        handleCloseDelete();
        getAllImages();
        setDataDelete(null);
      })
      .catch((err) => {
        toast.success("Delete images error.");
        console.log(err);
      });
  };

  const handleFullImage = (item, index) => {
    setDataImageView({ img: item, index: index });
  };

  const imgAction = (action) => {
    let index = dataImageView.index;
    if (action === "next") {
      setDataImageView({
        img: index === listUrl.length - 1 ? listUrl[0] : listUrl[index + 1],
        index: index === listUrl.length - 1 ? 0 : index + 1,
      });
    }
    if (action === "prev") {
      setDataImageView({
        img: index === 0 ? listUrl[listUrl.length - 1] : listUrl[index - 1],
        index: index === 0 ? listUrl.length - 1 : index - 1,
      });
    }
    if (!action) {
      setDataImageView({ img: "", index: 0 });
    }
  };

  return (
    <section className="site-content">
      {loading && checkConfirm && <LoadingService/>}
      {/* {dataImageView.img && (
        <div className="view-full-image">
          <button
            className="btn-action btn-action-left"
            onClick={() => imgAction("prev")}
          >
            <ArrowBackIcon />
          </button>
          <img src={dataImageView.img?.url} alt="view-full" />
          <button
            className="btn-action btn-action-right"
            onClick={() => imgAction("next")}
          >
            <ArrowForwardIcon />
          </button>
          <div className="action-full-image">
            <button
              className="btn-action-image btn-action-image-delete"
              onClick={() => clickDeleteImage(dataImageView)}
            >
              <DeleteIcon />
            </button>
            <button
              className="btn-action-image btn-action-image-close"
              onClick={() => imgAction("")}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )} */}
      <div className="container">
        {checkConfirm && (
          <div className="site-content-wrap">
            <h3>One__again's Gallery</h3>
            <button className="btn-upload" onClick={handleClickOpen}>
              Upload Images
            </button>
          </div>
        )}
        <div className="site-gallery">
          {!checkConfirm && (
            <div className="enter-code">
              <h3>Enter the verification code</h3>
              <div className="form-enter-code flex-box">
                <input type="text" onChange={(e) => onChangeCodeConfirm(e)} />
                <button onClick={(e) => handleConfirmValue(e)}>submit</button>
              </div>
            </div>
          )}
          {checkConfirm && (
            <div className="gallery-wrap">
              {listUrl.length === 0 && (
                <div className="empty-diary">
                  <h3>Up ảnh nào One__again</h3>
                  <img src={Smile} alt="empty-diary" />
                </div>
              )}
              <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2 }}>
                <Masonry gutter="10px">
                  {listUrl &&
                    uniqueArrayObject(listUrl, "fullPath").map(
                      (item, index) => (
                        <div className="gallery-item" key={index}>
                          <a href={item.url} data-fancybox="gallery">
                            <img
                              src={item.url}
                              alt="gallery"
                              onClick={() => handleFullImage(item, index)}
                            />
                          </a>
                        </div>
                      )
                    )}
                </Masonry>
              </ResponsiveMasonry>
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="dialog-delete">
          <div className="dialog-header">
            <h3 className="dialog-header-title">Choose Image</h3>
          </div>
          <div className="dialog-content">
            <button className="input-upload">
              <input
                type="file"
                onChange={(e) => onChangeUpload(e)}
                multiple
                accept="image/*"
              />
            </button>
            {images.length > 0 && <progress value={progress} max="100" />}
            <div className={`preview-file flex-box ${classFlexbox}`}>
              {images &&
                images.map((image, index) => (
                  <div className="img-item" key={index}>
                    <img src={URL.createObjectURL(image)} alt="preview" />
                  </div>
                ))}
            </div>
          </div>
          <div className="dialog-bottom">
            <button
              className="btn-action-dialog btn-cancel"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="btn-action-dialog btn-upload"
              disabled={images.length > 0 ? false : true}
              onClick={handleUpload}
            >
              upload
            </button>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="dialog-delete">
          <div className="dialog-header">
            <h3 className="dialog-header-title">Delete Image</h3>
          </div>
          <div className="dialog-content dialog-delete-image">
            <h3 style={{ marginBottom: "10px" }}>Ảnh thì xóa thoải mái nhá!</h3>
            {dataDelete && <img src={dataDelete.url} alt="gallery-delete" />}
          </div>
          <div className="dialog-bottom">
            <button
              className="btn-action-dialog btn-cancel"
              onClick={handleCloseDelete}
            >
              Cancel
            </button>
            <button
              className="btn-action-dialog btn-upload"
              disabled={dataDelete ? false : true}
              onClick={handleDeleteImage}
            >
              Agree
            </button>
          </div>
        </div>
      </Dialog>
    </section>
  );
}
