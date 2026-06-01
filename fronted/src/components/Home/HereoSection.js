function HeroSection(){
    return(
        <>
        <div className="hero">
  <div className="container">
    <div className="row align-items-center">
      <div className="col-lg-7">
        <div className="intro-wrap">
          <h1 className="mb-5">
            <span className="d-block">Let's Enjoy Your</span> Trip In{" "}
            <span className="typed-words"></span>
          </h1>

          <div className="row">
            <div className="col-12">
              <form className="form">
                <div className="row mb-2">
                  <div className="col-sm-12 col-md-6 mb-3 mb-lg-0 col-lg-4">
                    <select name="" id="" className="form-control custom-select">
                      <option value="">Destination</option>
                      <option value="">Peru</option>
                      <option value="">Japan</option>
                      <option value="">Thailand</option>
                      <option value="">Brazil</option>
                      <option value="">United States</option>
                      <option value="">Israel</option>
                      <option value="">China</option>
                      <option value="">Russia</option>
                    </select>
                  </div>
                  <div className="col-sm-12 col-md-6 mb-3 mb-lg-0 col-lg-5">
                    <input type="text" className="form-control" name="daterange" />
                  </div>
                  <div className="col-sm-12 col-md-6 mb-3 mb-lg-0 col-lg-3">
                    <input type="text" className="form-control" placeholder="# of People" />
                  </div>
                </div>

                <div className="row align-items-center">
                  <div className="col-sm-12 col-md-6 mb-3 mb-lg-0 col-lg-4">
                    <input type="submit" className="btn btn-primary btn-block" value="Search" />
                  </div>
                  <div className="col-lg-8">
                    <label className="control control--checkbox mt-3">
                      <span className="caption">Save this search</span>
                      <input type="checkbox" defaultChecked />
                      <div className="control__indicator"></div>
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-5">
        <div className="slides">
          <img src="images/hero-slider-1.jpg" alt="Image" className="img-fluid active" />
          <img src="images/hero-slider-2.jpg" alt="Image" className="img-fluid" />
          <img src="images/hero-slider-3.jpg" alt="Image" className="img-fluid" />
          <img src="images/hero-slider-4.jpg" alt="Image" className="img-fluid" />
          <img src="images/hero-slider-5.jpg" alt="Image" className="img-fluid" />
        </div>
      </div>
    </div>
  </div>
</div>
        </>
    )
}
export default HeroSection