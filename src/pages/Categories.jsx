import React, { Component } from 'react'
import {Container, Grid, Button, Table,
    TableRow, TableHead, TableBody, TableCell,
    TableFooter, TablePagination, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, CircularProgress, Paper, Icon,
    Box} from '@material-ui/core'
import SearchBar from 'material-ui-search-bar'

import CustomButton from '../components/Button.jsx'
import CustomIconButton from '../components/IconButton.jsx'

import Header from '../components/Header.jsx'
import {ToastContainer, toast} from 'react-toastify'
import axios from 'axios'
import {backendUrl} from '../config/backend'

import {Redirect, Link} from 'react-router-dom'
class Categories extends Component {
    state = { 
        categories: [],
        loading: true,
        query: '',
        page: 1,
        count: 0,
        limit: 10,
        error: false,
        dialog: false,
        loadingOp: false,
        themeSelected: null

    }

    async changeQueryValue(query){
        await this.setState({
            query,
            page: 1
        })

        this.searchCategories()
    }

    async searchCategories(){
        const url = `${backendUrl}/categories?page=${this.state.page}&query=${this.state.query}&limit=${this.state.limit}`
        if(this.state.categories.length > 0) this.setState({categories: []})
        if(!this.state.loading) this.setState({loading: true})
        await axios(url).then(res => {
            this.setState({
                categories: res.data.categories,
                count: res.data.count,
                limit: res.data.limit,
                error: false,
                loading: false,
            })
        }).catch(error => {
            this.setState({error: true})
        })
    }

    async remove(){
        this.setState({loadingOp: true})
        const id = this.state.themeSelected._id
        const url = `${backendUrl}/theme/${id}`

        await axios.delete(url).then(() => {
            toast.success((<div className="centerInline"><Icon>done</Icon><span>Operação realizada com sucesso</span></div>), {autoClose: 3000, closeOnClick: true})
        }).catch(error => {
            toast.error((<div className="centerInline"><Icon>clear</Icon><span>{error.response.data || 'Ocorreu um erro desconhecido, se persistir reporte'}</span></div>), {autoClose: 3000, closeOnClick: true})
        })
        this.setState({loadingOp: false, dialog: false})
        this.searchCategories()
    }

    goTo = path => event => {
        this.setState({
            redirectTo: `/${path}`
        })
    }

    selectTheme = theme => event => {
        this.setState({
            dialog: true,
            themeSelected: theme 
        })
    }

    componentDidMount(){
        this.searchCategories()
    }

    render() { 
        return ( 
            <Container>
                <ToastContainer />
                {this.state.redirectTo && <Redirect to={this.state.redirectTo} />}
                <Header title="Categorias" description="categorias para artigos" icon="category"></Header>
                <Container className="hudBar">
                    <Grid item className="hudBarChild">
                        <Box mr={1} className="linkButton">
                            <Link to="/category" className="linkRouter linkButton"><CustomButton color="default" text="Nova Categoria" icon="add_circle_outline" /></Link>
                        </Box>
                        <Box mr={1} className="linkButton">
                            <Link to="/management" className="linkRouter linkButton"><CustomButton color="gray" text="Configurações" icon="settings" /></Link>
                        </Box>
                    </Grid>
                    <Grid item className="hudBarChild">
                        <SearchBar id="search_field" className="searchTextField" placeholder="Pesquisar" value={this.state.query} onChange={(query) => this.changeQueryValue(query)} onCancelSearch={() => this.changeQueryValue('')} />
                    </Grid>
                </Container>
                {this.state.loading && <Container className="center spinnerContainer"><CircularProgress/><p>Carregando, por favor aguarde...</p></Container>}
                {!this.state.loading && this.state.categories.length === 0 && <Container className="center"><p className="defaultFontColor">Ops, Nenhum resultado encontrado</p></Container>}
                {this.state.categories.length > 0 && !this.state.loading && <Paper>
                <Container className="wrapper">
                    <Table className="defaultTable">
                        <TableHead>
                            <TableRow>
                                <TableCell><span className="centerVertical"><Icon fontSize="small">category</Icon>Categoria</span></TableCell>
                                <TableCell><span className="centerVertical"><Icon fontSize="small">bookmark_border</Icon>Alias</span></TableCell>
                                <TableCell><span className="centerVertical"><Icon fontSize="small">bookmark</Icon>Tema</span></TableCell>
                                <TableCell><span className="centerVertical"><Icon fontSize="small">build</Icon>Ações</span></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.categories.map(category => (
                            <TableRow key={category._id}>
                                <TableCell scope="name">
                                    {category.name}
                                </TableCell>
                                <TableCell scope="alias">
                                    {category.alias}
                                </TableCell>
                                <TableCell scope="theme">
                                    {category.theme.name || 'Sem categoria'}
                                </TableCell>
                                <TableCell scope="_id">
                                    <CustomIconButton icon="edit" color="default" aria-label="Editar" tooltip="Editar" onClick={this.goTo(`edit-category/${category._id}`)} />
                                    <CustomIconButton icon="delete_forever" color="danger" aria-label="Delete" tooltip="Remover" onClick={this.selectTheme(category)}/>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination 
                                    rowsPerPageOptions={[10,25,50]}
                                    colSpan={3}
                                    count={this.state.count}
                                    rowsPerPage={this.state.limit}
                                    labelRowsPerPage="Limite: "
                                    labelDisplayedRows={(value) => `${value.from}-${value.to} de ${value.count}`}
                                    page={this.state.page - 1}
                                    SelectProps={{
                                        inputProps: {'aria-label': 'Limite'},
                                    }}
                                    onChangePage={async (event, page) => {
                                        await this.setState({
                                            page: ++page
                                        })
                                        
                                        this.searchCategories()
                                    }}
                                    
                                    onChangeRowsPerPage={async (event) => {
                                        await this.setState({
                                            limit: parseInt(event.target.value)
                                        })

                                        this.searchCategories()
                                    }}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <Dialog
                        open={this.state.dialog}
                        onClose={() => {
                            this.setState({
                                dialog: false
                            })
                        }}
                        aria-labelledby="title"
                        aria-describedby="are_you_sure"
                    >
                        <DialogTitle id="title">{this.state.loadingOp ? "Removendo" : "Excluir usuário"}</DialogTitle>
                        <DialogContent>
                            <Container>
                                {!this.state.loadingOp &&<DialogContentText id="are_you_sure">
                                    Tem certeza que deseja remover este tema?
                                </DialogContentText>}
                                {this.state.loadingOp && <DialogContentText id="description">
                                    Removendo tema, por favor aguarde...
                                </DialogContentText>}
                            </Container>
                        </DialogContent>
                        <DialogActions>
                            { !this.state.loadingOp && <Button color="primary" onClick={() => {
                            this.setState({
                                dialog: false
                            })
                        }}>Fechar</Button>}
                            {!this.state.loadingOp && <Button color="secondary" onClick={async () => {
                            await this.remove(this.state.themeSelected)
                        }}>Sim, pode excluir</Button>}
                        </DialogActions>
                    </Dialog>
                </Container>
                </Paper>}
            </Container>
        )
    }
}

export default Categories