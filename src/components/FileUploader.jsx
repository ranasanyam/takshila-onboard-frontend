import React from 'react';

const FileUploader = ({
    file,
    error,
    handleFileChange
  }) => {
    const onDrop = (e) => { 
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      console.log('file', file);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.addEventListener("load", function () {
        handleFileChange(file);
      })
    }
    const fileHandler = (event) => {
      const file = event.target.files[0];
      handleFileChange(file);
    }
    
  
    return (
      <div className='min-h-[100vh] flex flex-col justify-center items-center'>
        <div className='flex flex-col items-start gap-2 bg-[#DCFAFA] text-[#323232] p-[2rem] rounded-3xl w-auto text-center'
      >
        <div>
        <div className='flex flex-col'>
            <label
              htmlFor="file-input"
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onDrop={onDrop}
              className='mb-1 scroll-m-60'
            >
              <div 
              className="bg-[#DCFAFA] rounded-lg px-6 sm:px-10 py-4 sm:py-6 [border:1px_solid_#C9C5CA]"
              >
                <div 
                >
                  <div className="flex flex-col items-center justify-between gap-4">
                    <div className="bg-white flex justify-center items-center mr-6 rounded-full shrink-0 p-4 h-14 w-14 sm:h-[72px] sm:w-[72px]">
                      <img
                        src="/icons/upload.svg"
                        alt="upload"
                        className="sm:w-10"
                      />
                    </div>
                    <div className="text-sm">
                      <div className="text-[#322F37] mb-2 sm:text-base">
                        <div>
                          Click to Upload or Drag & Drop here. 
                          <br></br>
                          {/* Total size should be less than 10 MB  */}
                          Supported formats: .jpeg, .png,
                          .pdf
                        </div>
                      </div>
                    </div>
                    <input
                      onChange={fileHandler}
                      type="file"
                      id="file-input"
                      name="file-input"
                      className="file-input"
                      accept='.csv, .xlsx'
                    />
                  </div>

                </div>
              </div>
            </label>
          </div>

        <div>
        {file && (
            <div
              className="[border:1px_solid_#C9C5CA] rounded-lg p-3 sm:p-5 flex items-center mt-3 bg-white"
            >
              <img
                className="h-5 sm:h-8 sm:w-8 flex justify-center items-center mr-1 sm:mr-2 shrink-0"
                src="/icons/invoice.svg"
                alt="file"
              />
              <div
                className="cursor-pointer truncate max-w-[280px] text-[#322F37] text-xs sm:text-lg  pr-[2px]"
              >
                {file.name}
                
              </div>
              </div>
        )}
        {error && (
          <div className='error-message max-w-[350px]'>
            {error}
          </div>
        )}
        </div>
        </div>
      </div>
      </div>
      
    )
}
export default FileUploader;