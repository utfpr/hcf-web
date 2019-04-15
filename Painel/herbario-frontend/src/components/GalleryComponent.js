import React, { Component } from 'react';
import ImageGallery from 'react-image-gallery';

// const PREFIX_URL = "https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/";

export default class GalleryComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <ImageGallery items={this.props.fotos} />;
    }
}
