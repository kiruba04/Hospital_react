import React from 'react';
import './ClinicInfoPage.css';

const ClinicInfoPage = () => {
  return (
    <div className="clinic-page-container">
      <main className="clinic-page-content">
        <div className="clinic-page-text">
          <h1>It's not just about where you receive care. It's about how it's provided.</h1>
          <p>
            In a patient-first world, quality care can happen anywhere. Our clinic believes in 
            providing reliable, compassionate, and expert care, whether you're visiting us in 
            person or accessing our services online. This commitment has made us one of the 
            region's most trusted healthcare providers, with thousands of satisfied patients 
            and a wide range of services to meet your needs.
          </p>
          <p>
            Today, we're the trusted partner for patients looking for personalized care, 
            families seeking reliable healthcare, and communities striving for better health outcomes. 
            Our clinic helps:
          </p>
          <ul>
            <li>
              <strong>Patients,</strong> by ensuring they receive quality care, wherever and 
              whenever they need it.
            </li>
            <li>
              <strong>Families,</strong> by providing support and information to help them 
              take care of their loved ones.
            </li>
            <li>
              <strong>Communities,</strong> by promoting health and wellness through 
              accessible services and education.
            </li>
          </ul>
        </div>
        <div className="clinic-page-image">
          <img src="https://res.cloudinary.com/dsgdnskfj/image/upload/v1723218291/OIP_1_mv1vvc.jpg" alt="Clinic care" />
        </div>
      </main>
      <footer className="clinic-page-footer">
        <p>© CopyRight 2024 Sri Ethiraj Technology</p>
      </footer>
    </div>
  );
}

export default ClinicInfoPage;
