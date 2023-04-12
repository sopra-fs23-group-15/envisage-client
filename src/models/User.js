/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.userName = null;
    this.token = null;
    this.status = null;
    Object.assign(this, data);
  }
}
export default User;
