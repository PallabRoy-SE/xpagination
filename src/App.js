import { useEffect, useState } from "react";
import "./App.css";

/**
 * Represents the main application component.
 */
function App() {
  /**
   * Represents the list of all employees.
   */
  const [employees, setEmployees] = useState([]);

  /**
   * Represents the list of employees to be displayed on the current page.
   */
  const [currEmployees, setCurrEmployees] = useState([]);

  /**
   * Represents the pagination data, including the current page and the number of items per page.
   */
  const [paginationData, setPaginationData] = useState({
    current: 0,
    itemPerPage: 10,
  });

  /**
   * Generates the list of employees to be displayed on the current page based on the pagination data.
   */
  const generateCurrentPageEmployees = () => {
    setCurrEmployees(() => [
      ...[...employees].splice(
        paginationData.current * paginationData.itemPerPage,
        paginationData.itemPerPage
      ),
    ]);
  };

  /**
   * Fetches the list of employees from the API.
   */
  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const resData = await response.json();
      setEmployees(() => [...resData]);
    } catch (error) {
      alert("failed to fetch data");
    }
  };

  /**
   * Handles the navigation between pages.
   * @param {number} moveTo - The number of pages to move (positive for next, negative for previous).
   */
  const handleNavigation = (moveTo) => {
    setPaginationData((prev) => ({ ...prev, current: prev.current + moveTo }));
  };

  useEffect(() => {
    // Fetch employees when the component mounts
    fetchEmployees();
  }, []);

  useEffect(() => {
    // Generate the list of employees for the current page whenever the pagination data or the employees list changes
    generateCurrentPageEmployees();
  }, [paginationData, employees]);

  return (
    <section className="main-container">
      <h1>Employee Data Table</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {currEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}></td>
          </tr>
        </tfoot>
      </table>
      <div>
        <button
          disabled={paginationData.current === 0}
          className="btn"
          onClick={() => handleNavigation(-1)}
        >
          Previous
        </button>
        <span className="btn">{paginationData.current + 1}</span>
        <button
          disabled={
            paginationData.current ===
            Math.ceil(employees.length / paginationData.itemPerPage) - 1
          }
          className="btn"
          onClick={() => handleNavigation(1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default App;
