function photographerTemplate(data) {
    const { name, id, city, country, tagline, price, portrait } = data;

    const picture = `assets/photographers/Photographers ID Photos/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement('article');
        article.setAttribute('role', 'article');
        article.setAttribute('aria-label', `${name}, photographe de ${city}, ${country}`);

        const link = document.createElement('a');
        link.setAttribute('href', `photographer.html?id=${id}`);
        link.setAttribute('aria-label', `Voir le profil de ${name}, photographe de ${city}, ${country}`);
        link.className = 'photographer-link';
        link.setAttribute('role', 'link');

        const img = document.createElement('img');
        img.setAttribute('src', picture);
        img.setAttribute('alt', `Portrait de ${name}`);
        img.className = 'photographer-portrait';

        const h2 = document.createElement('h2');
        h2.textContent = name;
        h2.className = 'photographer-name';

        const locationP = document.createElement('p');
        locationP.className = 'location';
        locationP.textContent = `${city}, ${country}`;

        const taglineP = document.createElement('p');
        taglineP.className = 'tagline';
        taglineP.textContent = tagline;

        const priceP = document.createElement('p');
        priceP.className = 'price';
        priceP.textContent = `${price}€/jour`;

        link.appendChild(img);
        link.appendChild(h2);

        article.appendChild(link);
        article.appendChild(locationP);
        article.appendChild(taglineP);
        article.appendChild(priceP);

        return article;
    }
    return { name, id, city, country, tagline, price, picture, getUserCardDOM }
}