--Creacion de las tablas (SQLServer)

create table usuarios (
    id int primary key identity(1,1),
    username varchar(50) not null unique,
    password varchar(255) not null, --espacio suficiente para la encriptacion
    rol varchar(20) not null,
    -- Restricción para que solo acepte estos dos roles
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
    -- Restricción para que solo acepte estos dos estados
    check (estado in ('Pendiente', 'Completada')), 
    -- Restricción de integridad solicitada
    check (fecha_vencimiento >= fecha_creacion) 
);


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

