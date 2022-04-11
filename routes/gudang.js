var express = require('express');
var router = express.Router();
var authentication_mdl = require('../middlewares/authentication');
var session_store;
/* GET gudang page. */

router.get('/',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM gudang',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('gudang/list',{title:"gudangs",data:rows,session_store:req.session});
		});
     });
});

router.delete('/delete/(:id)',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var gudang = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from gudang where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, gudang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/gudang');
				}
				else{
					req.flash('msg_info', 'Delete gudang Success'); 
					res.redirect('/gudangs');
				}
			});
		});
	});
});
router.get('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM gudang where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/gudangs'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "gudang can't be find!"); 
					res.redirect('/gudangs');
				}
				else
				{	
					console.log(rows);
					res.render('gudang/edit',{title:"Edit ",data:rows[0],session_store:req.session});

				}
			}

		});
	});
});
router.put('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.assert('nama', 'Please fill the nama').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_nama = req.sanitize( 'nama' ).escape().trim(); 
		v_kemasan = req.sanitize( 'kemasan' ).escape().trim();
		v_stok = req.sanitize( 'stok' ).escape().trim();
		v_harga = req.sanitize( 'harga' ).escape().trim();

		var gudang = {
			nama: v_nama,
			kemasan: v_kemasan,
			stok: v_stok,
			harga: v_harga
		}

		var update_sql = 'update gudang SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, gudang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('gudang/edit', 
					{ 
						nama: req.param('nama'), 
						kemasan: req.param('kemasan'),
						stok: req.param('stok'),
						harga: req.param('harga'),
					});
				}else{
					req.flash('msg_info', 'Update gudang success'); 
					res.redirect('/gudangs');
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.redirect('/gudangs');
	}
});

router.post('/add',authentication_mdl.is_login, function(req, res, next) {
	req.assert('nama', 'Please fill the nama').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_nama = req.sanitize( 'nama' ).escape().trim(); 
		v_kemasan = req.sanitize( 'kemasan' ).escape().trim();
		v_stok = req.sanitize( 'stok' ).escape().trim();
		v_harga = req.sanitize( 'harga' ).escape();

		var gudang = {
			nama: v_nama,
			kemasan: v_kemasan,
			stok: v_stok,
			harga : v_harga
		}

		var insert_sql = 'INSERT INTO gudang SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, gudang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('gudang/add', 
					{ 
						nama: req.param('nama'), 
						kemasan: req.param('kemasan'),
						stok: req.param('stok'),
						harga: req.param('harga'),
						session_store:req.session,
					});
				}else{
					req.flash('msg_info', 'Create gudang success'); 
					res.redirect('/gudangs');
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('gudang/add', 
		{ 
			name: req.param('nama'), 
			address: req.param('kemasan'),
			session_store:req.session
		});
	}

});

router.get('/add',authentication_mdl.is_login, function(req, res, next) {
	res.render(	'gudang/add', 
	{ 
		title: 'Add New nama',
		nama: '',
		kemasan: '',
		stok:'',
		harga:'',
		session_store:req.session
	});
});

module.exports = router;
