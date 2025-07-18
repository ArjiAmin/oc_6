    async function getPhotographers() {
        try {
            const response = await fetch('data/photographers.json');
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            return { photographers: [] };
        }
    }

    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        if (!photographersSection) {
            console.error('Section des photographes non trouvée');
            return;
        }

        photographers.forEach((photographer) => {
            const photographerModel = photographerTemplate(photographer);
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    }

    async function init() {
        // Récupère les datas des photographes
        const { photographers } = await getPhotographers();
        displayData(photographers);
    }
    
    init();
    
