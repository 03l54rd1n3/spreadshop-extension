//const twitch = window.twitch.ext;
let options = {};
let slideIndex = 0;
let timeout;

function init(config) {
    try {
        //var config = JSON.parse(twitch.configuration.broadcaster.content);
        config = config || {
            shopName: 'iYusuna',
            panelHeader: 'Hol dir deine Cookie-Liebe \u2764',
            panelFooter: 'im iYusuna Merch-Shop!',
            shopUrl: 'https://iyusuna.myspreadshop.de',
            products: [
                {
                    name: 'T-Shirt',
                    image: 'https://image.spreadshirtmedia.net/image-server/v1/products/T141A2PA6264PT17X5Y17D347086605W24013H26314/views/1,width=1000,height=1000,appearanceId=33/spread-love-kochschuerze.jpg',
                    url: 'https://iyusuna.myspreadshop.de/spread+love-A6817c03d3659f379838b5dd7?productType=141&amp;sellable=oNEZvNgYpwFwq5k8D3Aw-141-35&amp;appearance=33&amp;src=productFeed&amp;affiliateid=1259917'
                },
                {
                    name: 'Mug',
                    image: 'https://image.spreadshirtmedia.net/image-server/v1/products/T905A461PA1890PT32X51Y5D347086605W3919H4295/views/1,width=1000,height=1000,appearanceId=461/spread-love-snapback-cap.jpg',
                    url: 'https://iyusuna.https://iyusuna.myspreadshop.de/spread+love-A6817c03d3659f379838b5dd7?productType=905&amp;sellable=oNEZvNgYpwFwq5k8D3Aw-905-34&amp;appearance=461&amp;src=productFeed&amp;affiliateid=1259917.de/mug'
                },
                {
                    name: 'Hoodie',
                    image: 'https://image.spreadshirtmedia.net/image-server/v1/products/T905A461PA1890PT32X51Y5D347086605W3919H4295/views/1,width=1000,height=1000,appearanceId=546/spread-love-snapback-cap.jpg',
                    url: 'https://iyusuna.myspreadshop.de/spread+love-A6817c03d3659f379838b5dd7?productType=905&amp;sellable=oNEZvNgYpwFwq5k8D3Aw-905-34&amp;appearance=546&amp;src=productFeed&amp;affiliateid=1259917'
                }
            ],
            linkToDirectProducts: true,
            timePerProduct: 5000,
        };
        if (typeof config === 'object') {
            console.log('Writing config to options');
            options = config
            updateSlideshow();
            showSlide(slideIndex);
        } else {
            console.log('invalid config')
        }
    } catch (e) {
        console.log(e)
    }

}

//twitch.configuration.onChanged(function () {
    //if (twitch.configuration.broadcaster) {
        //init();
    //}
//});

function updateSlideshow() {
    console.log(options);
    $('.header').text(options.panelHeader);
    $('.footer').text(options.panelFooter);
    for (const product of shuffled(options.products)) {
        const productElement = document.createElement('div');
        productElement.className = 'product-slide fade';
        let url = options.linkToDirectProducts ? product.url : options.shopUrl;
        productElement.innerHTML = `
            <a href='${url}' target='_blank'>
                <img src='${product.image}' alt='${product.name}'>
            </a>
        `;
        $('.slideshow-container').append(productElement);
    }
}

// Next/previous
function moveSlides(n) {
    slideIndex += n;
    slideIndex = (slideIndex + options.products.length) % options.products.length;
    console.log('Current slide index: ' + slideIndex);
    showSlide(slideIndex);
}

function showSlide(n) {
    let i;
    let slides = document.getElementsByClassName('product-slide');

    for (let i = 0; i < slides.length; i++) {
        if (i === n) {
            slides[i].style.display = 'block';
            continue;
        }
        slides[i].style.display = 'none';
    }

    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(moveSlides, options.timePerProduct, 1);
}

$.ajax({
    url: 'https://iyusuna.myspreadshop.de/iyusuna/products.rss',
    data: null,
    success: function (data) {
        const $xml = $(data);

        let config = {
            shopName: $xml.find('channel > title').text(),
            panelHeader: 'Hol dir deine Cookie-Liebe \u2764',
            panelFooter: 'im iYusuna Merch-Shop!',
            shopUrl: $xml.find('channel > link').text(),
            products: [],
            linkToDirectProducts: true,
            timePerProduct: 5000,
        };

        // Iterate over each <item>
        $xml.find('item').each(function () {
            const title = $(this).find('g\\:title, title').text();
            const link = $(this).find('g\\:link, link').text();
            const image = $(this).find('g\\:image_link, image_link').text();
            config.products.push({
                name: title,
                url: link,
                image: image,
            });
        });

        init(config);
    },
    dataType: 'xml',
});