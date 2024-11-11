SELECT * 
FROM tkdb.pelea WHERE idllave IN(SELECT idllave FROM tkdb.llave WHERE idcampeonato=7 AND estado='A');

SELECT idpelea,idllave,idcompetidor1,idcompetidor2,idganador,tipo FROM tkdb.pelea WHERE 
idllave=341 AND tipo=0
ORDER BY idpelea;

select * from configuracion where id=1;

UPDATE tkdb.pelea SET idcompetidor2=1700, idganador=1700 WHERE idpelea=556 AND idllave=350;
UPDATE tkdb.pelea SET idcompetidor2=1497 WHERE idpelea=557 AND idllave=350;

SELECT COUNT(idclasificacion) FROM tkdb.clasificacion WHERE idcampeonato=10 AND tipo='P' AND estado='A';

UPDATE tkdb.pelea SET idganador=?,idperdedor=? WHERE idpelea=? AND idllave=?;
SELECT * FROM tkdb.llave WHERE idllave=341;
SELECT * from tkdb.pelea WHERE idllave=341;
UPDATE tkdb.llave SET idgrado=159,genero='M',idcategoria=107,idsubcategoria=676 WHERE idllave=342;
UPDATE tkdb.pelea set idcompetidor1=1781,idcompetidor2=1527 WHERE idllave=342 AND idpelea=546;

INSERT INTO tkdb.pelea(idllave,idcompetidor1,idcompetidor2,idganador) 
VALUES (360,0,1837,1837);
UPDATE tkdb.pelea SET idcompetidor1=0,idcompetidor2=1837,idganador=1837 WHERE idpelea=570;
UPDATE tkdb.pelea SET idcompetidor1=1842,idcompetidor2=1668,idganador=0 WHERE idpelea=599;

INSERT INTO tkdb.competidorsinpelea (nombres,apellidos,fecha,edad,peso,ci,idclub,
idcinturon,idcampeonato,tipo,estado,idgrado,genero,altura)
(SELECT nombres,apellidos,fecha,edad,peso,ci,idclub,
idcinturon,idcampeonato,tipo,estado,idgrado,genero,altura
 FROM tkdb.competidor WHERE idcompetidor=1467);
 
SELECT cmp.nombres,cmp.apellidos,cmp.edad,cmp.peso,cmp.idclub,
cmp.tipo,cb.nombre,cb.abreviado,
(case when cmp.tipo='C' THEN 'KIROUGUI' WHEN cmp.tipo='P' THEN 'POOMSEA' ELSE 'OTRO' END)as tipoCompe
FROM tkdb.competidor cmp LEFT JOIN tkdb.club cb ON cb.idclub=cmp.idclub
WHERE cmp.idcampeonato=10 AND cmp.estado='A' ORDER BY cmp.idclub,cmp.nombres,cmp.edad;