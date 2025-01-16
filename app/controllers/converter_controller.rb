class ConverterController < ApplicationController
  def index
  end

  def convert
    if params[:images].blank?
      return render json: { error: "Please select at least one image" }, status: :unprocessable_entity
    end

    begin
      temp_dir = Rails.root.join("tmp", "conversion_#{Time.now.to_i}")
      FileUtils.mkdir_p(temp_dir)

      if params[:merge] == 'true'
        # Generate single merged PDF
        image_paths = params[:images].map do |image|
          next if image.blank?
          image_path = File.join(temp_dir, image.original_filename)
          File.binwrite(image_path, image.read)
          image_path
        end.compact

        pdf_path = File.join(temp_dir, "merged_output.pdf")
        generate_pdf(image_paths, pdf_path)
        
        pdf_data = File.read(pdf_path)
        pdfs = [{
          data: Base64.strict_encode64(pdf_data),
          filename: "merged_#{Time.now.strftime('%Y%m%d_%H%M%S')}.pdf"
        }]
      else
        # Generate separate PDFs
        pdfs = params[:images].map.with_index do |image, index|
          next if image.blank?
          
          image_path = File.join(temp_dir, image.original_filename)
          File.binwrite(image_path, image.read)

          pdf_path = File.join(temp_dir, "output_#{index}.pdf")
          generate_pdf([image_path], pdf_path)
          
          {
            data: Base64.strict_encode64(File.read(pdf_path)),
            filename: "#{File.basename(image.original_filename, '.*')}.pdf"
          }
        end.compact
      end

      render json: { pdfs: pdfs }
    ensure
      FileUtils.rm_rf(temp_dir) if temp_dir && Dir.exist?(temp_dir)
    end
  end
  
  private

  def generate_pdf(image_paths, output_pdf)
    doc = HexaPDF::Document.new

    image_paths.each do |image_path|
      next unless image_path.present?
      image = MiniMagick::Image.new(image_path)
      width = image[:width]
      height = image[:height]

      width_in_pt = width * 72 / 96.0
      height_in_pt = height * 72 / 96.0

      page = doc.pages.add([ 0, 0, width_in_pt, height_in_pt ])
      canvas = page.canvas

      canvas.image(
        image_path,
        at: [ 0, 0 ],
        width: width_in_pt,
        height: height_in_pt
      )
    end

    doc.write(output_pdf)
  end
end