import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchImages } from './Api/fetchImages';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Searchbar } from './Searchbar/Searchbar';
import { Modal } from './Modal/Modal';

export const App = () => {
  const [images, setImages] = useState([]);
  const [currentSearchValue, setCurrentSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAlt, setModalAlt] = useState('');
  const [modalImg, setModalImg] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const inputSearchForm = e.target.elements.searchImag.value;

    if (inputSearchForm.trim() === '') {
      toast.warn('Please put something', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    }
    // setLoading(true);

    const dataImages = await fetchImages(inputSearchForm);
    if (dataImages.hits.length === 0) {
      toast.error(`We have not ${inputSearchForm} images`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }

    setImages(dataImages.hits);
    setCurrentSearchValue(inputSearchForm);
    setPage(1);
    setTotalPage(dataImages.totalHits);
    setLoading(false);
  };

  const handleClickMore = async e => {
    setLoading(true);

    const dataImages = await fetchImages(currentSearchValue, page + 1);

    setImages([...images, ...dataImages.hits]);
    setLoading(false);
    setPage(page + 1);
    setTotalPage(dataImages.totalHits);
  };

  const handleImageClick = e => {
    setShowModal(true);
    setModalAlt(e.target.alt);
    setModalImg(e.target.name);
  };

  const onCloseModal = e => {
    setShowModal(false);
    setModalAlt('');
    setModalImg('');
  };

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        onCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
  }, []);

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onCloseModal();
    }
  };

  const maxImages = Math.ceil(totalPage / 12) > page;

  return (
    <div>
      <Searchbar onSubmit={handleSubmit} />
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {loading && <Loader />}
      {images.length > 0 && maxImages && <Button onClick={handleClickMore} />}
      <ToastContainer />
      {showModal && (
        <Modal onClick={handleBackdropClick} src={modalImg} alt={modalAlt} />
      )}
    </div>
  );
};
