import styles from "./Homepage.module.css";
import page from "../../assets/page.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch } from "react-icons/fa";
const Fonts = () => {
  return (
    <>
      <div className={styles.find}>
        <div className={styles.font_container}>
          <div className={styles.font}>
            Find <span className={styles.text}>perfact</span> jobs{" "}
            <span className={styles.text}>Fit</span> for you
          </div>
          <div className={styles.font2}>
            jobs for you to explore, start explore thousands of jobs in one
            place
          </div>

          <div className={styles.inputfields}>
            <div className={styles.field}>
              <label htmlFor="Job Title" className="form-label">
                Job Title
              </label>
              <input
                className="form-control job_title "
                list="datalistOptions"
                id="exampleDataList"
                placeholder="Enter Job title.."
              ></input>
            </div>
            <div className={styles.field}>
              <label htmlFor="Job Type" className="form-label">
                Job Type
              </label>
              <select
                className="form-control job_title "
                list="datalistOptions"
                id="exampleDataList"
                placeholder="Enter Type"
              >
                <option selected>Enter Job type..</option>
                <option value="1">Part Time</option>
                <option value="2">Full Time</option>
                <option value="3">Remote</option>
              </select>
            </div>
            <div className={styles.search}>
              <button type="button" className={styles.btn}>
                <FaSearch className={styles.icon} />
              </button>
            </div>
          </div>
        </div>
        <div className={styles.pageimg}>
          <img src={page} alt="Future Fit" />
        </div>
      </div>
    </>
  );
};

export default Fonts;
