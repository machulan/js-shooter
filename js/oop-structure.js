function Parent(x) {
    this.x = x;
}

Parent.prototype.run = function() {
    alert('Parent running...');
    this.x++;
}

function Child(x, y) {
    this.y = y;
    Parent.apply(this, arguments);
}

// Child.prototype.__proto__ = Parent.prototype;
Child.prototype = Object.create(Parent.prototype);

Child.prototype.constructor = Child;

Child.prototype.run = function() {
    Parent.prototype.run.apply(this, arguments);
    alert('Child running...');
    this.x *= 2;
}

Child.prototype.stop = function() {
    alert('Child stopping...');
}

var child = new Child(3, 5);