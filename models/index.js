'use strict';

const Sequelize = require('sequelize');
const marked = require('marked');

const db = new Sequelize('postgres://localhost:5432/birdBook', {
    logging: false
});

const Post = db.define('post', {
    body: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    imageURL: {
        type: Sequelize.STRING,
        allowNull: true
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    hooks: {
        afterValidate: (page) => {'chirp chirp ' + this.body + ' chirp chirp';
        }
    }
});

const Bird = db.define('Bird', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    breed: {
        type: Sequelize.STRING,
        allowNull: false
    },
    favoriteNumber: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    favoriteColor: {
        type: Sequelize.STRING,
        allowNull: true
    },
    birdName: {
        type: Sequelize.STRING,
        allowNull: true
    }
    // friends: { // A list of bird’s names who are this bird’s friend. Remember that name is a primary key, so this is essentially a link to their friends.
    //     type: Sequelize.ARRAY(Sequelize.TEXT),
    //     defaultValue: [],
    //     allowNull: false,
    //     set: function (friends) {

    //         friends = friends || [];

    //         if (typeof friends === 'string') {
    //             friends = friends.split(',').map(function (str) {
    //                 return str.trim();
    //             });
    //         }

    //         this.setDataValue('friends', friends);

    //     }
    // },
}, {
    getterMethods: {
        route: function(){
            return '/bird/' + this.name;
        }
    },
    classMethods: {
        findByBreed: (breed) => this.findAll({
            where: {
                breeds: {
                    $contains: [breed]
                }
            }
        })
    },
    instanceMethods: {
        // findFriends: () => Bird.findAll({
        //     where: {
        //         name: {
        //             $ne: this.name
        //         },
        //     }
        // }),
        findPosts: () => Bird.findAll({
            where: {
                name: this.name
            }
        })
    },
    hooks: {
        beforeValidate: (bird) => {
            if (bird.name) {
                bird.name = bird.name.replace(/\s/g, '_').replace(/\W/g, '');
            } else {
                bird.name = Math.random().toString(36).substring(2, 7);
            }
            if (!bird.birdName) {
                bird.birdName = bird.name + " Bird";
            }
        }
        // beforeUpdate: (bird) => {
        //     bird.birdName = bird.name + " Bird";
        // }
    }
});

// Bird.belongsToMany(Bird, {as: 'Friend', through: 'Friendships'});


module.exports = {
    Post: Post,
    Bird: Bird
};
