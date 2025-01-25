class ConvertTxtService
  attr_reader :text

  def initialize(text)
    @text = text
  end

  def convert
    file_path = generate_txt_file
    result = {
      success: true,
      file_path: file_path,
      filename: File.basename(file_path),
      content_type: 'text/plain'
    }
    at_exit { FileUtils.rm_f(file_path) }
    
    result
  rescue StandardError => e
    { success: false, error: e.message }
  end

  private

  def generate_txt_file
    file_path = "output_#{Time.now.to_i}.txt"
    File.open(file_path, 'w') do |file|
      file.write(text)
    end
    file_path
  end
end