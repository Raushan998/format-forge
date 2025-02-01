module Api
    module V1
      class PdfsController < ApplicationController
        def compress
          uploaded_file = params[:file]
          compression_percentage = params[:percentage].to_i.clamp(0, 95)
  
          unless uploaded_file.content_type == 'application/pdf'
            return render_error('Invalid file type. Please upload a PDF.')
          end
  
          pdf_compressor = PdfCompressorService.new(
            uploaded_file.tempfile,
            compression_percentage
          )
  
          compressed_pdf = pdf_compressor.compress
  
          send_file compressed_pdf.path,
                    filename: "compressed_#{compression_percentage}percent.pdf",
                    type: 'application/pdf',
                    disposition: 'attachment'
        rescue StandardError => e
          Rails.logger.error "PDF Compression Error: #{e.message}"
          render_error('Compression failed. Please try again.')
        end
  
        private
  
        def render_error(message)
          render json: { error: message }, status: :unprocessable_entity
        end
      end
    end
end