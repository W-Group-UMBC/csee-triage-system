import styles from "../styles/login.module.css";

export default function Login() {
  return (
    <div className={styles.loginPage}>
      <div className={styles.leftSection}>
        <div className={styles.loginContainer}>
          <div className={styles.header}>
            <div className={styles.logoSection}>
              <div className={styles.logo}>
                <img src="../images/department-lockup.png" alt="UMBC Shield" />
              </div>
            </div>

            <div className={styles.pageTitle}>
              CSEE FAQ / Triage Faculty Tools
            </div>
            <h2 className={styles.formTitle}>Faculty Log In</h2>
          </div>

          <form
            action="/idp/profile/SAML2/Redirect/SSO?execution=e1s2"
            method="post"
            name="upass"
          >
            <div className={styles.field}>
              <label>Email Address / Username / Campus ID</label>
              <input type="text" name="j_username" />
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <input type="password" name="j_password" />
            </div>

            <div className={styles.actions}>
              <input
                type="submit"
                value="Log In"
                className={styles.loginBtn}
              />
              
            </div>

            <div className={styles.forgotPassword}>
              <a href="https://webadmin.umbc.edu/admin/Security/PasswordAssistance">
                Forgot your password?
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.rightSection}>
        SOME <br />
        UMBC <br />
        PIC
      </div>
    </div>
  );
}
