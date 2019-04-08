import { Schema } from 'mongoose';

const models = {};

export function history(schema, options?) {
    console.log(options);
    options = options || {};
    const ObjectId = Schema.Types.ObjectId,
        ignoredFields = options.ignore || [ '_id', 'createdAt', 'updatedAt' ],
        primaryKeyName = options.primaryKeyName || '_id';

    var getHistoricalModel = function(model) {
        var connection = options.connection || model.constructor.collection.conn,
            name = (options.name || model.constructor.modelName) + '_hist',
            primaryKeyType =
                options.primaryKeyType ||
                /* DEPRECATED */ options.idType ||
                (model.constructor.schema.paths[primaryKeyName].options.type || ObjectId);

        if (!model.constructor.schema.paths[primaryKeyName]) {
            throw new Error('History error: Missing primary key `' + primaryKeyName + '` in schema `' + name + '`.');
        }
        console.log(name);
        console.log(options);
        console.log(model.constructor.modelName);
        var createHistoricalSchema = function() {
            var hschema = new Schema(
                {
                    document: { type: primaryKeyType, index: true },
                    timestamp: { type: Date, default: Date.now, index: true },
                    diff: Schema.Types.Mixed
                },
                { collection: name, versionKey: false }
            );

            hschema.pre('save', function(next) {
                var diff = this.get('diff');

                ignoredFields.forEach((field) => {
                    delete diff[field];
                });

                this.set('diff', diff);
                next();
            });

            return hschema;
        };

        models[name] = models[name] || connection.model(name, createHistoricalSchema());

        return models[name];
    };
    /*
    var arrayMerge = function(a, b) {
        return _.isArray(b) ? b : undefined;
    };
*/
    var read = function(o, p) {
        for (var i = 0, a = p.split('.'), l = a.length; i < l; i++) {
            o = o[a[i]];
        }
        return o;
    };

    var write = function(o, p, v) {
        for (var i = 0, a = p.split('.'); i < a.length - 1; i++) {
            var n = a[i];
            if (n in o) {
                o = o[n];
            } else {
                o[n] = {};
                o = o[n];
            }
        }
        o[a[a.length - 1]] = v;
    };

    schema.pre('save', function(next) {
        var me = this,
            HistoricalModel = getHistoricalModel(me),
            modified = me.modifiedPaths(),
            diff = this.isNew ? me.toObject({ virtuals: false }) : {};

        if (!this.isNew) {
            modified.forEach(function(index) {
                var value = read(me.toObject({ virtuals: false }), index);
                /*if (_.isPlainObject(value)) {
                    return;
                }*/
                if (value === undefined) {
                    write(diff, index, null);
                    return;
                }
                write(diff, index, value);
            });
        }

        var historical = new HistoricalModel({
            document: me[primaryKeyName],
            diff: diff
        });
        historical.save(next);
    });

    schema.pre('remove', function(next) {
        var me = this,
            HistoricalModel = getHistoricalModel(me);

        var historical = new HistoricalModel({
            document: me[primaryKeyName],
            diff: null
        });
        historical.save(next);
    });

    schema.methods.historicalSnapshot = function(callback?: Function) {
        var me = this,
            HistoricalModel = getHistoricalModel(me);

        if (me.modifiedPaths().length) {
            return callback(new Error('Historical error: Attempted to snapshot an unsaved/modified document.'));
        }

        var snapshot = me.toObject();
        delete snapshot[primaryKeyName];
        delete snapshot.__v;

        var historical = new HistoricalModel({
            document: me[primaryKeyName],
            diff: snapshot
        });

        // const callback = callback ? callback : () => {};
        historical.save(function(e) {
            return callback ? (e ? callback(e) : callback(null, me)) : null;
        });
    };

    schema.methods.historicalClear = function(callback?: Function) {
        var me = this,
            HistoricalModel = getHistoricalModel(me);

        callback = callback ? callback : () => {};

        HistoricalModel.find({ document: me[primaryKeyName] }, function(e, objs) {
            if (e) {
                return callback(e);
            }
            me.historicalSnapshot(function(e) {
                if (e) {
                    return callback(e);
                }
                objs.forEach(function(obj) {
                    obj.remove();
                });
                return callback(null, me);
            });
        });
    };

    schema.methods.historicalRestore = function(date, callback?: Function) {
        var me = this,
            HistoricalModel = getHistoricalModel(me),
            surrogate = {};

        callback = callback ? callback : () => {};
        /*
        if (!_.isDate(date) || date.getTime() > new Date().getTime()) {
            return callback(new Error('Historical error: Invalid date.'));
        }
*/
        HistoricalModel.find(
            {
                document: me[primaryKeyName],
                timestamp: { $lte: date }
            },
            null,
            { sort: { timestamp: 1 } },
            function(e, objs) {
                if (e) {
                    return callback(e);
                }
                if (!objs) {
                    return callback(null, null);
                }
                /*
                objs.forEach(function(obj) {
                    surrogate = obj.diff ? _.merge(surrogate, obj.diff, arrayMerge) : null;
                });
*/
                if (!surrogate) {
                    return callback(null, null);
                }

                var meObj = {};
                /* me.constructor.schema.paths.forEach(function(pair) {
                    write(meObj, pair[0], null);
                });
                delete meObj[primaryKeyName];
                delete meObj.__v;
*/
                // me.set(_.merge(meObj, surrogate, arrayMerge));
                return callback(null, me);
            }
        );
    };

    schema.methods.historicalTrim = function(date, callback) {
        var me = this,
            HistoricalModel = getHistoricalModel(me);

        callback = callback ? callback : () => {};
        /*
        if (!_.isDate(date) || date.getTime() > new Date().getTime()) {
            return callback(new Error('Historical error: Invalid date.'));
        }
*/
        me.historicalRestore(date, function(e, obj) {
            if (e) {
                return callback(e);
            }
            if (!obj) {
                return callback(null, me);
            }
            HistoricalModel.remove({ document: me[primaryKeyName], timestamp: { $lte: date } }, function(e) {
                if (e) {
                    return callback(e);
                }
                var trimmed = new HistoricalModel({
                    document: me[primaryKeyName],
                    diff: obj.toObject(),
                    timestamp: date
                });
                trimmed.save(function(e) {
                    return e ? callback(e) : callback(null, me);
                });
            });
        });
    };

    schema.methods.historicalDetails = function(date, callback) {
        var me = this,
            HistoricalModel = getHistoricalModel(me);

        callback = callback ? callback : () => {};
        /*
        if (!_.isDate(date) || date.getTime() > new Date().getTime()) {
            return callback(new Error('Historical error: Invalid date.'));
        }
*/
        HistoricalModel.find(
            {
                document: me[primaryKeyName],
                timestamp: { $lte: date }
            },
            null,
            { sort: { timestamp: 1 } },
            function(e, objs) {
                return e ? callback(e) : callback(null, objs);
            }
        );
    };

    schema.methods.historical = function() {
        /*var me = this,
            action = null,
            date = new Date(),
            callback = function() {},
            args = Array.prototype.slice.call(arguments, 0, 3);

        if (_.isString(args[0])) {
            action = args[0];
        }

        if (_.isDate(args[1])) {
            date = args[1];
        }

        if (_.isFunction(args[args.length - 1])) {
            callback = args[args.length - 1];
        }

        switch (action) {
            case 'snapshot':
                me.historicalSnapshot(callback);
                break;
            case 'clear':
                me.historicalClear(callback);
                break;
            case 'restore':
                me.historicalRestore(date, callback);
                break;
            case 'trim':
                me.historicalTrim(date, callback);
                break;
            case 'history':
            case 'details':
            default:
                me.historicalDetails(date, callback);
        }*/
    };
}
