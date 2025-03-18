import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import styles from "./Employees.module.css";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    user_email: "",
    user_mobile: "",
    created_at: "",
    isEmailVerified: "No",
  });

  useEffect(() => {
    fetch("http://localhost:8081/api/employee")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Employees Data:", data);
        setEmployees(data);
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmployees = employees.filter((employee) => {
    const email = employee.user_email ? employee.user_email.toLowerCase() : "";
    return email.includes(searchQuery.toLowerCase());
  });

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      user_email: employee.user_email || "",
      user_mobile: employee.user_mobile || "",
      created_at: employee.created_at || "",
      isEmailVerified: employee.isEmailVerified || "No",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingEmployee) {
      if (!editingEmployee.user_id) {
        console.error("Error: Missing user_id for update");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8081/api/employee/${editingEmployee.user_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server error: ${text}`);
        }

        setEmployees((prev) =>
          prev.map((emp) =>
            emp.user_id === editingEmployee.user_id
              ? { ...emp, ...formData }
              : emp
          )
        );
        setShowModal(false);
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    } else {
      try {
        const res = await fetch("http://localhost:8081/api/employee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server error: ${text}`);
        }

        const newEmployee = await res.json();
        setEmployees((prev) => [...prev, newEmployee]);
        setShowModal(false);
      } catch (error) {
        console.error("Error adding employee:", error);
      }
    }
  };

  const handleDelete = async (user_id) => {
    if (!user_id) {
      console.error("Error: Missing user_id for deletion");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8081/api/employee/${user_id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${text}`);
      }

      setEmployees((prev) => prev.filter((emp) => emp.user_id !== user_id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className={styles.employees}>
      <div className={styles.header}>
        <h1>Employees</h1>
        <button className={styles.addButton} onClick={() => setShowModal(true)}>
          <FiPlus /> Add Employee
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Mobile</th>
              <th>Created At</th>
              <th>Email Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.user_id}>
                <td>{employee.user_email || "N/A"}</td>
                <td>{employee.user_mobile || "N/A"}</td>
                <td>{employee.created_at || "N/A"}</td>
                <td>{employee.isEmailVerified || "No"}</td>
                <td className={styles.actions}>
                  <button
                    onClick={() => handleEdit(employee)}
                    className={styles.editButton}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(employee.user_id)}
                    className={styles.deleteButton}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{editingEmployee ? "Edit Employee" : "Add Employee"}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Email:</label>
                <input
                  type="email"
                  value={formData.user_email}
                  onChange={(e) =>
                    setFormData({ ...formData, user_email: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Mobile:</label>
                <input
                  type="text"
                  value={formData.user_mobile || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, user_mobile: e.target.value })
                  }
                />
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingEmployee ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;

// import { useState } from 'react';
// import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
// import styles from './Employees.module.css';

// const Employees = () => {
//   const [employees, setEmployees] = useState([
//     { id: 1, name: 'John Doe', email: 'john@example.com', department: 'HR', position: 'Manager', joinDate: '2023-01-15' },
//     { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'IT', position: 'Developer', joinDate: '2023-02-20' },
//   ]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [editingEmployee, setEditingEmployee] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     department: '',
//     position: '',
//     joinDate: ''
//   });

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const filteredEmployees = employees.filter(employee =>
//     employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     employee.department.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleAdd = () => {
//     setEditingEmployee(null);
//     setFormData({
//       name: '',
//       email: '',
//       department: '',
//       position: '',
//       joinDate: ''
//     });
//     setShowModal(true);
//   };

//   const handleEdit = (employee) => {
//     setEditingEmployee(employee);
//     setFormData(employee);
//     setShowModal(true);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this employee?')) {
//       setEmployees(employees.filter(emp => emp.id !== id));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (editingEmployee) {
//       setEmployees(employees.map(emp =>
//         emp.id === editingEmployee.id ? { ...formData, id: emp.id } : emp
//       ));
//     } else {
//       setEmployees([...employees, { ...formData, id: Date.now() }]);
//     }
//     setShowModal(false);
//   };

//   return (
//     <div className={styles.employees}>
//       <div className={styles.header}>
//         <h1>Employees</h1>
//         <button className={styles.addButton} onClick={handleAdd}>
//           <FiPlus /> Add Employee
//         </button>
//       </div>

//       <div className={styles.searchBar}>
//         <input
//           type="text"
//           placeholder="Search employees..."
//           value={searchQuery}
//           onChange={handleSearch}
//         />
//       </div>

//       <div className={styles.tableContainer}>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Department</th>
//               <th>Position</th>
//               <th>Join Date</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredEmployees.map(employee => (
//               <tr key={employee.id}>
//                 <td>{employee.name}</td>
//                 <td>{employee.email}</td>
//                 <td>{employee.department}</td>
//                 <td>{employee.position}</td>
//                 <td>{employee.joinDate}</td>
//                 <td className={styles.actions}>
//                   <button onClick={() => handleEdit(employee)} className={styles.editButton}>
//                     <FiEdit2 />
//                   </button>
//                   <button onClick={() => handleDelete(employee.id)} className={styles.deleteButton}>
//                     <FiTrash2 />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {showModal && (
//         <div className={styles.modal}>
//           <div className={styles.modalContent}>
//             <h2>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
//             <form onSubmit={handleSubmit}>
//               <div className={styles.formGroup}>
//                 <label>Name:</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData({...formData, name: e.target.value})}
//                   required
//                 />
//               </div>
//               <div className={styles.formGroup}>
//                 <label>Email:</label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({...formData, email: e.target.value})}
//                   required
//                 />
//               </div>
//               <div className={styles.formGroup}>
//                 <label>Department:</label>
//                 <input
//                   type="text"
//                   value={formData.department}
//                   onChange={(e) => setFormData({...formData, department: e.target.value})}
//                   required
//                 />
//               </div>
//               <div className={styles.formGroup}>
//                 <label>Position:</label>
//                 <input
//                   type="text"
//                   value={formData.position}
//                   onChange={(e) => setFormData({...formData, position: e.target.value})}
//                   required
//                 />
//               </div>
//               <div className={styles.formGroup}>
//                 <label>Join Date:</label>
//                 <input
//                   type="date"
//                   value={formData.joinDate}
//                   onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
//                   required
//                 />
//               </div>
//               <div className={styles.modalActions}>
//                 <button type="submit" className={styles.submitButton}>
//                   {editingEmployee ? 'Update' : 'Add'}
//                 </button>
//                 <button type="button" onClick={() => setShowModal(false)} className={styles.cancelButton}>
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Employees;
