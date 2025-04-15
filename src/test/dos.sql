SELECT lv.idllave,lv.fecha,lv.tipo,lv.genero,lv.idcategoria,lv.idsubcategoria,lv.idgrado,
lv.estado,lv.area,cat.nombre AS nombrecategoria,cat.edadini,cat.edadfin,grad.nombre AS namegrado,
subcat.nombre AS namesubcategoria,subcat.pesoini,subcat.pesofin
FROM tkdb.llave lv 
INNER JOIN 
(SELECT c.* from tkdb.categoria c WHERE estado='A'
	UNION SELECT -1,'EXHIBICIÓN',1,1,7,'M','A'
	UNION SELECT -1,'EXHIBICIÓN',1,1,7,'F','A') cat
ON lv.idcategoria=cat.idcategoria AND cat.genero=lv.genero
LEFT JOIN 
(SELECT -1 AS idgrado,'MANUAL' AS nombre,'C'AS tipo,7 AS idcampeonato,'A' AS estado UNION
SELECT gr.* FROM tkdb.grado gr WHERE gr.estado!='E') grad
ON grad.idgrado=lv.idgrado
LEFT JOIN 
(SELECT -1 AS idsubcategoria,-1 AS idcategoria,'EXHIBICIÓN' AS nombre,-1 AS pesoini,
-1 AS pesofin UNION SELECT subc.* FROM tkdb.subcategoria subc) subcat
ON subcat.idsubcategoria=lv.idsubcategoria
WHERE lv.idcampeonato=7 AND (-2=-2 or lv.idcategoria=79) AND lv.tipo='C';

SELECT idpelea,idllave,idganador,tipo FROM tkdb.pelea WHERE idganador is not NULL
        AND idllave=377 AND tipo='C' ORDER BY idpelea;