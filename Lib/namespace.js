
function createNamespace(name) {
    // Check name for validity.  It must exist, and must not begin or
    // end with a period or contain two periods in a row.
    if (!name) throw new Error("Module.createNamespace( ): name required");
    if (name.charAt(0) == '.' ||
        name.charAt(name.length-1) == '.' ||
        name.indexOf("..") != -1)
        throw new Error("Module.createNamespace( ): illegal name: " + name);

    // Break the name at periods and create the object hierarchy we need
    var parts = name.split('.');

    // For each namespace component, either create an object or ensure that
    // an object by that name already exists.
    var container = this;
    for(var i = 0; i < parts.length; i++) {
        var part = parts[i];
        // If there is no property of container with this name, create
        // an empty object.
        if (!container[part]) container[part] = {};
        else if (typeof container[part] != "object") {
            // If there is already a property, make sure it is an object
            var n = parts.slice(0,i).join('.');
            throw new Error(n + " already exists and is not an object");
        }
        container = container[part]; 
    }

    // The last container traversed above is the namespace we need.
    var namespace = container;

    // It is an error to define a namespace twice. It is okay if our
    // namespace object already exists, but it must not already have a
    // NAME property defined.
    if (namespace.NAME) throw new Error("Module "+name+" is already defined");

    // Return the namespace object to the caller
    return namespace;
}
