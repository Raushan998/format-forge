export const SEOConfig = {
    default: {
      title: 'Format Forge - Image Processing Tools',
      description: 'Transform your images with Format Forge. Convert images to PDF, add signatures, compress images, and translate text in images.',
      keywords: 'image tools, format forge, image processing, online tools',
      image: 'https://www.format-forge.in/icon.png',
    },
    routes: {
      '/': {
        title: 'Format Forge - Convert, Sign, and Compress Images',
        description: 'Transform your images with Format Forge. Convert images to PDF, add signatures, compress images, and translate text in images.',
        keywords: 'image converter, pdf converter, image tools, image compression, image signature, text translation, format forge',
        schema: {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Format Forge',
          applicationCategory: 'Image Processing Tool',
          description: 'All-in-one image processing platform'
        }
      },
      '/image-to-pdf': {
        title: 'Convert Images to PDF | Format Forge',
        description: 'Convert your images to PDF format easily. Support for multiple image formats, batch conversion, and high-quality output.',
        keywords: 'image to pdf, convert jpg to pdf, png to pdf, image conversion, pdf creator, multiple images to pdf, batch conversion',
        schema: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Image to PDF Converter',
          applicationCategory: 'Converter'
        }
      },
      '/image-signature': {
        title: 'Add Signatures to Images | Format Forge',
        description: 'Add digital signatures to your images securely. Create, save, and manage multiple signatures.',
        keywords: 'digital signature, image signature, sign documents, electronic signature, signature maker, signature generator',
        schema: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Image Signature Tool',
          applicationCategory: 'Digital Signature'
        }
      },
      '/image-compressor': {
        title: 'Compress Images Online | Format Forge',
        description: 'Reduce image file size without losing quality. Batch compress multiple images at once.',
        keywords: 'image compression, compress photos, reduce image size, image optimizer, photo compression, bulk image compression',
        schema: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Image Compressor',
          applicationCategory: 'Image Processing'
        }
      },
      '/image-text-translator': {
        title: 'Image Text Translation | Format Forge',
        description: 'Extract and translate text from images into multiple languages. Accurate OCR and translation.',
        keywords: 'image text translation, OCR translation, extract text from image, image to text, photo translator, multi language translation',
        schema: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Image Text Translator',
          applicationCategory: 'Translation Tool'
        },
      '/pdf-compressor':{
        title: 'Compress Pdf | Format Forge',
        description: 'Compress the pdf',
        keywords: 'compress the pdf, resize the pdf, reduce the size of pdf',
        schema:{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Pdf Compressor',
          applicationCategory: 'Pdf Processing'
        },
        '/image-svg-converter':{
          title: 'Convert Image to SVG',
          description: 'Convert Image to SVG',
          keywords: 'convert jpg to svg, convert png to svg, convert jpeg to svg, convert webp to svg',
          schema:{
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Image SVG Converter',
            applicationCategory: 'SVG Converter'
          }
        }
      }
      }
   }
};