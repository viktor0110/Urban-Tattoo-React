import { useState, useEffect } from 'react';
import styles from '../../styles/views/GalleryPage.module.css'
import Spinner from '../Spinner';
import MissingTattoos from '../MissingTattoos';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function GalleryPage() {
    const [tattoos, setTattoos] = useState([]);
    const [model, setModel] = useState(false);
    const [tempImgSrc, setTempImgSrc] = useState('');
    const user = { _role: 'admin'};

    function openFullImg(imageUrl) {
        setTempImgSrc(imageUrl);
        setModel(true);
    };

    function escHandler(e) {
        if (e.code === "Escape") {
            setModel(false)
            document.removeEventListener('keydown', escHandler );
          }
    };

    useEffect(() => {
        fetch('http://localhost:5000/data/tattoos')
            .then(res => res.json())
                .then(data => setTattoos(data));
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', escHandler);
    });

    return (
        <section id="galleryPage" className={styles['galleryPage']}>
            <div className={model ? `${styles['model-open']}` : `${styles.model}`}>
                    {model ? 
                    <>
                        <img  className={styles['model-open-img']} src={tempImgSrc} alt="tattoo" />
                        <FontAwesomeIcon className={styles['model-open-x']} onClick={() => setModel(false) } icon={faCircleXmark} />
                        {user._role === 'admin' ? 
                        <FontAwesomeIcon className={styles['model-open-delete']} onClick={() => alert('are you sure?') } icon={faTrashCan} />
                        :
                        null
                        }
                        
                    </> 
                    : null}
            </div>
            {tattoos.length > 0
            ? 
            <div className={styles['img-gallery']}>
                {tattoos.length > 0 ?
                    tattoos.map(tattoo => <div key={tattoo._id} onClick={()=> openFullImg(tattoo.imageUrl)} ><img src={tattoo.imageUrl} alt="no-img" data-id={tattoo._id}/></div>)
                    :
                    <MissingTattoos />}
            </div> 
            : <Spinner />}
        </section>
    );
};