const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// create associations
// User can have many posts and comments
User.hasMany(Post, {
    foreignKey: 'user_id'
});
User.hasMany(Comment, {
    foreignKey: 'user_id'
});
// Post can belong to one user but can have many comments
Post.belongsTo(User, {
    foreignKey: 'user_id',
});
Post.hasMany(Comment, {
    foreignKey: 'post_id'
});
// Comment can belong to one user and post
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Comment };