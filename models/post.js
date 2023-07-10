const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model { }

Post.init(
    {
        // define columns
        id: { //id column
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: { //title column
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        content: { //content column
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        user_id: { //foreign key
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        //pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        //dont pluralize name of database table
        freezeTableName: true,
        //use underscores instead of camel-casing
        underscored: true,
        //make it so model name stays lowercase in database
        modelName: 'post'
    })

module.exports = Post;