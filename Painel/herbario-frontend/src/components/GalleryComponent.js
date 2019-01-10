import React, { Component } from 'react';
import ImageGallery from 'react-image-gallery';

// const PREFIX_URL = "https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/";

export default class GalleryComponent extends Component {
    constructor(props) {
        super(props);
    }



    render() {
        const images = [
            {
                original:
                    "https://hypescience.com/wp-content/uploads/2017/07/plantas-mais-perigosas-assustadoras-8.jpg",
                thumbnail:
                    "https://hypescience.com/wp-content/uploads/2017/07/plantas-mais-perigosas-assustadoras-8.jpg"
            },
            {
                original:
                    "https://hypescience.com/wp-content/uploads/2017/07/plantas-mais-perigosas-assustadoras-8.jpg",
                thumbnail:
                    "https://hypescience.com/wp-content/uploads/2017/07/plantas-mais-perigosas-assustadoras-8.jpg"
            },
            {
                original:
                    "https://hypescience.com/wp-content/uploads/2017/07/plantas-mais-perigosas-assustadoras-8.jpg",
                thumbnail:
                    "https://hypescience.com/wp-content/uploads/2017/07/plantas-mais-perigosas-assustadoras-8.jpg"
            }
        ];

        return <ImageGallery items={this.props.fotos} />;
    }
}
