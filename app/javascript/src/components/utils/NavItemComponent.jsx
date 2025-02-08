import React from 'react'

export const NavItemComponent = {
    'File Converters': {
      features: [
        { 
          name: 'Image', 
          path: '/image',
          subFeatures: [
            { name: 'Image to PDF', path: '/image-to-pdf' },
            { name: 'Image to SVG', path: '/image-svg-converter'}
          ]
        }
      ]
    },
    'Signature Overlay': {
      features: [
        { 
          name: 'Image', 
          path: '/image',
          subFeatures: [
            { name: 'Overlay Signature To Image', path: '/image-signature' }
          ]
        }
      ]
    },
    'File Compressor': {
      features: [
        { 
          name: 'Image', 
          path: '/image',
          subFeatures: [
            { name: 'Image Compressor', path: '/image-compressor' }
          ]
        },
        {
           name: 'Pdf',
           path: '/pdf',
           subFeatures: [
             { name: 'Pdf Compressor', path: '/pdf-compressor'}
           ]
        }
      ]
    },
    'Translator': {
      features: [
        { 
          name: 'Image', 
          path: '/image',
          subFeatures: [
            { name: 'Image Text Translator', path: '/image-text-translator' }
          ]
        }
      ]
    }
};