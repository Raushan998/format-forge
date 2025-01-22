require 'puppeteer'
require 'tempfile'

module Puppeteer
  class TextToPdfService
    def initialize(text)
      @text = text.to_s
      @timestamp = Time.current.utc
    end

    def convert
      temp_file = generate_temp_pdf
      
      {
        success: true,
        pdf_path: temp_file.path,
        filename: generate_filename,
        content_type: 'application/pdf'
      }
    rescue StandardError => e
      Rails.logger.error("PDF Generation Error: #{e.full_message}")
      { success: false, error: e.message }
    end

    private

    def generate_temp_pdf
      temp_file = Tempfile.new(['document', '.pdf'])
      
      ::Puppeteer.launch(
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      ) do |browser|
        page = browser.new_page
        page.set_content(generate_html)
        
        page.pdf(
          path: temp_file.path,
          format: 'A4',
          printBackground: true,
          margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
          preferCSSPageSize: true
        )
      end

      temp_file
    end

    def generate_filename
      "document_#{@timestamp.strftime('%Y%m%d_%H%M%S')}.pdf"
    end

    def generate_html
      <<~HTML
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            @page { size: A4; margin: 0; }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              margin: 0;
              padding: 20px;
              line-height: 1.6;
            }
            .header { text-align: center; padding: 20px; }
            .content { 
              word-wrap: break-word;
              overflow-wrap: break-word;
              white-space: pre-wrap; /* This ensures that \n (newline) characters are handled correctly */
            }
            .footer {
              position: fixed;
              bottom: 20px;
              width: 100%;
              text-align: center;
            }
            @media print {
              .page-break { page-break-after: always; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            Generated at: #{@timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')}
          </div>
          <div class="content">#{@text}</div>
          <div class="footer">
            Page <span class="pageNumber"></span>
          </div>
        </body>
        </html>
      HTML
    end
  end
end