//Mettre le code JavaScript lié à la page photographer.html

let currentMedia = [];
let displayedMedia = [];
let currentPhotographer = null;
let currentModalIndex = 0;

async function getPhotographerData() {
    try {
        const response = await fetch('data/photographers.json');
        const data = await response.json();
        console.log('Données complètes:', data);
        return data;
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        return { photographers: [], media: [] };
    }
}

function getPhotographerIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('ID du photographe depuis l\'URL:', id);
    return id ? parseInt(id) : null;
}

function findPhotographerById(photographers, id) {
    const photographer = photographers.find(p => p.id === id);
    console.log('Photographe trouvé:', photographer);
    return photographer;
}

function getPhotographerMedia(media, photographerId) {
    const photographerMedia = media.filter(m => m.photographerId === photographerId);
    console.log('Médias du photographe:', photographerMedia);
    return photographerMedia;
}

function displayPhotographerInfo(photographer) {
    if (!photographer) {
        console.error('Aucun photographe à afficher');
        return;
    }

    const nameElement = document.getElementById('photographer-name');
    const locationElement = document.querySelector('.photographer-location');
    const taglineElement = document.querySelector('.photographer-tagline');
    const portraitElement = document.getElementById('photographer-portrait');
    const priceElement = document.querySelector('.photographer-price');

    if (nameElement) nameElement.textContent = photographer.name;
    if (locationElement) locationElement.textContent = `${photographer.city}, ${photographer.country}`;
    if (taglineElement) taglineElement.textContent = photographer.tagline;
    if (priceElement) priceElement.textContent = `${photographer.price}€ / jour`;

    if (portraitElement) {
        portraitElement.src = `assets/photographers/Photographers ID Photos/${photographer.portrait}`;
        portraitElement.alt = `Portrait de ${photographer.name}`;
    }

    document.title = `Fisheye - ${photographer.name}`;
}

function displayMedia(media) {
    const mediaGallery = document.querySelector('.media-gallery');
    if (!mediaGallery) return;

    mediaGallery.innerHTML = '';
    displayedMedia = media;

    media.forEach((item, index) => {
        const mediaElement = createMediaElement(item, index);
        mediaGallery.appendChild(mediaElement);
    });
}

function createMediaElement(mediaItem, index) {
    const tpl = document.getElementById('media-item-template');
    const clone = tpl.content.cloneNode(true);
    const article = clone.querySelector('article');
    const container = clone.querySelector('.media-container');

    if (mediaItem.image) {
        const img = document.createElement('img');
        img.src = `assets/photographers/${getPhotographerFolderName()}/${mediaItem.image}`;
        img.alt = mediaItem.title;
        img.className = 'media-content';
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', `Ouvrir ${mediaItem.title} en plein écran`);
        img.addEventListener('click', () => openMediaModal(index));
        img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openMediaModal(index);
            }
        });
        container.appendChild(img);
    } else if (mediaItem.video) {
        const videoThumbnail = document.createElement('div');
        videoThumbnail.className = 'media-content video-thumbnail';
        videoThumbnail.setAttribute('tabindex', '0');
        videoThumbnail.setAttribute('role', 'button');
        videoThumbnail.setAttribute('aria-label', `Ouvrir la vidéo ${mediaItem.title} en plein écran`);

        const playIcon = document.createElement('i');
        playIcon.className = 'fa-solid fa-play video-play-icon';
        playIcon.setAttribute('aria-hidden', 'true');

        videoThumbnail.appendChild(playIcon);

        videoThumbnail.addEventListener('click', () => openMediaModal(index));
        videoThumbnail.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openMediaModal(index);
            }
        });
        container.appendChild(videoThumbnail);
    }

    clone.querySelector('.media-title').textContent = mediaItem.title;
    const likesCount = clone.querySelector('.likes-count');
    likesCount.textContent = mediaItem.likes;
    const heart = clone.querySelector('.heart-icon');
    heart.setAttribute('aria-label', `Aimer ${mediaItem.title}`);

    heart.innerHTML = '<img src="assets/icons/heart.svg" alt="" class="heart-svg">';

    heart.addEventListener('click', function() {
        toggleLike(heart, likesCount, mediaItem);
    });

    heart.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleLike(heart, likesCount, mediaItem);
        }
    });

    article.setAttribute('aria-label', `${mediaItem.title}, ${mediaItem.likes} likes`);
    return article;
}

function getPhotographerFolderName() {
    const photographerName = document.getElementById('photographer-name')?.textContent;
    if (!photographerName) return '';

    const folderMap = {
        'Mimi Keel': 'Mimi',
        'Ellie-Rose Wilkens': 'Ellie Rose',
        'Tracy Galindo': 'Tracy',
        'Nabeel Bradford': 'Nabeel',
        'Rhode Dubois': 'Rhode',
        'Marcel Nikolic': 'Marcel'
    };

    return folderMap[photographerName] || '';
}

function toggleLike(heartButton, likesCountElement, mediaItem) {
    const isLiked = heartButton.classList.contains('liked');

    if (isLiked) {
        heartButton.classList.remove('liked');
        mediaItem.likes--;
        heartButton.setAttribute('aria-label', `Aimer ${mediaItem.title}`);
    } else {
        heartButton.classList.add('liked');
        mediaItem.likes++;
        heartButton.setAttribute('aria-label', `Ne plus aimer ${mediaItem.title}`);
    }

    likesCountElement.textContent = mediaItem.likes;

    updateTotalLikes();
}

function calculateTotalLikes(media) {
    return media.reduce((total, item) => total + item.likes, 0);
}

function updateTotalLikes() {
    const totalLikes = calculateTotalLikes(currentMedia);
    const totalLikesElement = document.querySelector('.total-likes');

    if (totalLikesElement) {
        totalLikesElement.innerHTML = `${totalLikes} <span aria-hidden="true">♥</span>`;
        totalLikesElement.setAttribute('aria-label', `${totalLikes} likes au total`);
    }
}

function displayStats(media) {
    updateTotalLikes();
}

function sortMedia(media, sortBy) {
    const sortedMedia = [...media];

    switch (sortBy) {
        case 'popularity':
            return sortedMedia.sort((a, b) => b.likes - a.likes);
        case 'date':
            return sortedMedia.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'title':
            // TODO: asc ou desc ?
            return sortedMedia.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return sortedMedia;
    }
}

function setupSortingEventListener() {
    const sortSelect = document.getElementById('sort-select');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', (event) => {
        const sortBy = event.target.value;
        const sortedMedia = sortMedia(currentMedia, sortBy);
        displayMedia(sortedMedia);

        const mediaGallery = document.querySelector('.media-gallery');
        if (mediaGallery) {
            const sortLabels = {
                'popularity': 'triés par popularité',
                'date': 'triés par date',
                'title': 'triés par titre'
            };
            mediaGallery.setAttribute('aria-label', `Galerie de médias ${sortLabels[sortBy]}`);
        }
    });
}

function openMediaModal(index) {
    currentModalIndex = index;
    const modal = document.getElementById('media_modal');
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');

    displayModalMedia();

    document.body.style.overflow = 'hidden';

    const closeButton = modal.querySelector('.media-modal-close');
    if (closeButton) {
        closeButton.focus();
    }
}

function closeMediaModal() {
    const modal = document.getElementById('media_modal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';

    const modalImage = document.getElementById('modal-image');
    const modalVideo = document.getElementById('modal-video');
    modalImage.style.display = 'none';
    modalVideo.style.display = 'none';
    modalVideo.pause();
}

function displayModalMedia() {
    if (!displayedMedia || currentModalIndex < 0 || currentModalIndex >= displayedMedia.length) {
        return;
    }

    const mediaItem = displayedMedia[currentModalIndex];
    const modalImage = document.getElementById('modal-image');
    const modalVideo = document.getElementById('modal-video');
    const modalTitle = document.querySelector('.media-modal-title');
    const modal = document.getElementById('media_modal');
    const prevButton = modal.querySelector('.media-modal-prev');
    const nextButton = modal.querySelector('.media-modal-next');

    modalTitle.textContent = mediaItem.title;

    if (mediaItem.image) {
        modalVideo.style.display = 'none';
        modalVideo.pause();
        modalImage.src = `assets/photographers/${getPhotographerFolderName()}/${mediaItem.image}`;
        modalImage.alt = mediaItem.title;
        modalImage.style.display = 'block';
        prevButton.setAttribute('aria-label', 'Previous image');
        nextButton.setAttribute('aria-label', 'Next image');
    } else if (mediaItem.video) {
        modalImage.style.display = 'none';
        modalVideo.src = `assets/photographers/${getPhotographerFolderName()}/${mediaItem.video}`;
        modalVideo.style.display = 'block';
        prevButton.setAttribute('aria-label', 'Previous video');
        nextButton.setAttribute('aria-label', 'Next video');
    }
}

function nextModalMedia() {
    if (currentModalIndex < displayedMedia.length - 1) {
        currentModalIndex++;
        displayModalMedia();
    }
}

function prevModalMedia() {
    if (currentModalIndex > 0) {
        currentModalIndex--;
        displayModalMedia();
    }
}

function setupModalEventListeners() {
    const modal = document.getElementById('media_modal');
    const closeButton = modal.querySelector('.media-modal-close');
    const prevButton = modal.querySelector('.media-modal-prev');
    const nextButton = modal.querySelector('.media-modal-next');

    closeButton.addEventListener('click', closeMediaModal);
    prevButton.addEventListener('click', prevModalMedia);
    nextButton.addEventListener('click', nextModalMedia);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeMediaModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            switch (e.key) {
                case 'Escape':
                    closeMediaModal();
                    break;
                case 'ArrowLeft':
                    prevModalMedia();
                    break;
                case 'ArrowRight':
                    nextModalMedia();
                    break;
            }
        }
    });
}

async function init() {
    const photographerId = getPhotographerIdFromURL();

    if (!photographerId) {
        console.error('Aucun ID de photographe trouvé dans l\'URL');
        window.location.href = 'index.html';
        return;
    }

    const data = await getPhotographerData();
    const photographer = findPhotographerById(data.photographers, photographerId);

    if (!photographer) {
        console.error('Photographe non trouvé');
        window.location.href = 'index.html';
        return;
    }

    const media = getPhotographerMedia(data.media, photographerId);

    currentMedia = media;
    currentPhotographer = photographer;

    displayPhotographerInfo(photographer);

    const sortedMedia = sortMedia(media, 'popularity');
    displayMedia(sortedMedia);

    displayStats(media);

    setupSortingEventListener();
    setupModalEventListeners();
}

init();