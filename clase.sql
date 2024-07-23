CREATE TABLE Clientes (
    ClienteID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50),
    Dirección VARCHAR(100),
    Teléfono VARCHAR(20)
);

ALTER TABLE Clientes ADD FechaNacimiento DATE;

DROP TABLE Clientes;

INSERT INTO Clientes (ClienteID, Nombre, Dirección, Teléfono)
VALUES (1, 'Juan Pérez', '123 Calle Principal', '555-1234');

UPDATE Clientes SET Teléfono = '555-5678' WHERE ClienteID = 1;

DELETE FROM Clientes WHERE ClienteID = 1;

SELECT Nombre, Dirección FROM Clientes WHERE ClienteID = 1;

SELECT Nombre, Teléfono FROM Clientes WHERE Dirección LIKE 'Calle%';

SELECT Nombre, Dirección FROM Clientes ORDER BY Nombre ASC;

CREATE TABLE Pedidos (
    PedidoID INT AUTO_INCREMENT PRIMARY KEY,
    Fecha DATE,
    Monto DECIMAL(10, 2),
    ClienteID INT,
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID)
);

-- Insertar datos en la tabla Clientes
INSERT INTO Clientes (ClienteID, Nombre, Dirección, Teléfono)
VALUES
(1, 'Juan Pérez', '123 Calle Principal', '555-1234'),
(2, 'María García', '456 Avenida Secundaria', '555-5678');

-- Insertar datos en la tabla Pedidos
INSERT INTO Pedidos (PedidoID, Fecha, Monto, ClienteID)
VALUES
(1, '2023-01-01', 100.00, 1),
(2, '2023-01-15', 150.50, 1),
(3, '2023-02-10', 200.75, 2);

SELECT Clientes.Nombre, Pedidos.PedidoID, Pedidos.Fecha, Pedidos.Monto
FROM Clientes
INNER JOIN Pedidos ON Clientes.ClienteID = Pedidos.ClienteID;

SELECT Clientes.Nombre, Pedidos.PedidoID, Pedidos.Fecha, Pedidos.Monto
FROM Clientes
LEFT JOIN Pedidos ON Clientes.ClienteID = Pedidos.ClienteID;

SELECT Clientes.Nombre, Pedidos.PedidoID, Pedidos.Fecha, Pedidos.Monto
FROM Clientes
RIGHT JOIN Pedidos ON Clientes.ClienteID = Pedidos.ClienteID;

SELECT Clientes.Nombre, Pedidos.PedidoID, Pedidos.Fecha, Pedidos.Monto
FROM Clientes
FULL OUTER JOIN Pedidos ON Clientes.ClienteID = Pedidos.ClienteID;

Obtener el Promedio del Monto de los Pedidos por Cliente (AVG)

SELECT ClienteID, AVG(Monto) AS PromedioMonto
FROM Pedidos
GROUP BY ClienteID;

Contar el Número de Pedidos por Cliente (COUNT)

SELECT ClienteID, COUNT(PedidoID) AS NumeroPedidos
FROM Pedidos
GROUP BY ClienteID;

Obtener el Monto Total y Número de Pedidos por Cliente (SUM, COUNT, y GROUP BY)

SELECT ClienteID, SUM(Monto) AS MontoTotal, COUNT(PedidoID) AS NumeroPedidos
FROM Pedidos
GROUP BY ClienteID;

Obtener el Promedio del Monto de los Pedidos y el Número de Pedidos por Cliente con Detalles de Cliente (JOIN y GROUP BY)


SELECT Clientes.Nombre, AVG(Pedidos.Monto) AS PromedioMonto, COUNT(Pedidos.PedidoID) AS NumeroPedidos
FROM Clientes
JOIN Pedidos ON Clientes.ClienteID = Pedidos.ClienteID
GROUP BY Clientes.Nombre;



