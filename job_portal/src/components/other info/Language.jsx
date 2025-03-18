import React, { useState, useEffect } from "react";
import styles from "./SkillAndLanguage.module.css";
import { TbLanguageHiragana } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
const Language = ({ language, onSave }) => {
  // for language
  const [lang, setlang] = useState(language || []);
  const [addlang, setaddlang] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setlang(language || []); // Update skills if skillsData prop changes
  }, [language]);

  const enterlang = () => {
    if (addlang.trim() !== "") {
      setlang((prev) => [...prev, addlang.trim()]);
      setaddlang("");
      setErrMessage("");
    } else {
      setErrMessage("Enter language");
    }
  };

  const deletelanguage = (indexToDelete) => {
    setlang(lang.filter((_, index) => index !== indexToDelete));
  };

  const savelanguage = async (e) => {
    e.preventDefault();
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      setErrMessage("User ID is missing. Please log in again.");
      return;
    }

    if (lang.length === 0) {
      setErrMessage("Please add at least one language before saving.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8081/api/skill_or_languages",
        {
          user_id,
          skill_or_language: lang,
          type: "language",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      onSave(lang); // Notify parent component with the updated skills list
      if (response.data.status === "success") {
        alert("language saved successfully!");
      } else {
        setErrMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error saving language:", error);
      setErrMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <form onSubmit={savelanguage}>
          <h2 className={styles.formTitle}>Add languages</h2>
          <label>Enter known languages</label>
          <div className={styles.input}>
            <input
              type="text"
              value={addlang}
              onChange={(e) => setaddlang(e.target.value)}
              placeholder="Add a languages"
              className={styles.inputField}
            />
            <TbLanguageHiragana className={styles.icon} />

            <button type="button" onClick={enterlang} className={styles.add}>
              Add language
            </button>
          </div>
          {errMessage && <p className={styles.errMessage}>{errMessage}</p>}
          <div className={styles.skillcard}>
            {lang.map((langs, index) => (
              <div key={index} className={styles.skilldiv}>
                <p className={styles.skillText}>{langs}</p>
                <RxCross2
                  className={styles.deleteImg}
                  onClick={() => deletelanguage(index)}
                />
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.save} disabled={loading}>
              {loading ? "Saving..." : "Save Skills"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Language;
