SELECT * FROM 
(SELECT *,
	(select nombre from club where idclub=c.idclub) as club, 
   (select nombre from cinturon where idcinturon=c.idcinturon) as cinturon, 
   (SELECT gr.nombre FROM grado gr inner join cinturon cin on cin.idgrado=gr.idgrado where cin.idcinturon=c.idcinturon) as grado, 
   (select cate.idcategoria from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin 
   	and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as idcategoria, 
        (select cate.nombre from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin 
        and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as nombrecategoria 
        FROM competidor c WHERE c.idcampeonato=10 and c.tipo='C' and c.estado="A" ) as res 
		  where res.idcategoria in (select idcategoria from categoria where estado="P") order by res.edad,res.peso;
		  
SELECT * FROM pelea WHERE idllave=443;