--Creacion de las tablas (SQLServer)

create table usuarios (
    id int primary key identity(1,1),
    username varchar(50) not null unique,
    password varchar(255) not null, --espacio suficiente para el hash
    rol varchar(20) not null,
    -- Restriccion para que solo acepte estos dos roles
    check (rol in ('Administrador', 'Usuario_Normal')) 
);

create table tareas (
    id int primary key identity(1,1),
    titulo varchar(100) not null,
    estado varchar(20) default 'Pendiente',
    fecha_creacion date default getdate(), --Guarde la fecha actual
    fecha_vencimiento date,
    usuario_id int not null,
    foreign key (usuario_id) references usuarios(id),
    -- Restriccion para que solo acepte estos dos estados
    check (estado in ('Pendiente', 'Completada')), 
    -- Restriccion de integridad solicitada
    check (fecha_vencimiento >= fecha_creacion) 
);

------------------------------------------------
--Insertar 3 usuarios y 5 tareas
----------------------------------------

insert into usuarios (username, password, rol) values 
('admin_master', 'hash123', 'Administrador'),
('dev_juan', 'hash456', 'Usuario_Normal'),
('analista_maria', 'hash789', 'Usuario_Normal');

-- Insertamos 5 tareas asignadas a distintos usuarios
insert into tareas (titulo, estado, fecha_creacion, fecha_vencimiento, usuario_id) values
-- Tarea normal para el futuro (Pendiente)
('Configurar servidor backend', 'Pendiente', GETDATE(), DATEADD(day, 5, GETDATE()), 2),

-- Tarea completada
('Diseñar esquema de base de datos', 'Completada', '2026-03-20', '2026-03-25', 2),

-- Tarea normal para el futuro (Pendiente)
('Crear dashboard en Power BI', 'Pendiente', GETDATE(), DATEADD(day, 10, GETDATE()), 3),

-- TAREAS ATRASADAS (Creadas en el pasado y vencidas en el pasado, respetando el CHECK)
('Optimizar consultas SQL', 'Pendiente', '2026-03-01', '2026-03-15', 3),
('Revisar seguridad', 'Pendiente', '2026-03-10', '2026-03-12', 1);

--------------------------------------------------

--Consultas requeridas

--1. Listado completo de tareas ordenadas por proximidad de vencimiento
select * from tareas
order by fecha_vencimiento asc;

--2.Conteo de tareas pendientes y completadas agrupadas por usuario:
select username, t.estado, count(t.id) as TotalTareas from usuarios s
inner join tareas t on s.id = t.usuario_id
group by s.username, t.estado

--3.Consulta de tareas atrasadas
select * from tareas
where estado = 'Pendiente' and fecha_vencimiento < GETDATE();

